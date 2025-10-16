import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../config/prisma.service';
import { RedisService } from '../../../config/redis.service';
import { EmailService } from '../../email/email.service';
import { authenticator } from 'otplib';
import { OtpType } from '@prisma/client';

@Injectable()
export class OtpService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async generateAndSendOtp(
    email: string,
    type: OtpType = OtpType.EMAIL_VERIFICATION,
  ): Promise<{ success: boolean; message: string }> {
    // Vérifier le rate limiting (1 OTP par minute par email)
    const rateLimitKey = `otp_rate_limit:${email}:${type}`;
    const existingRate = await this.redis.get(rateLimitKey);

    if (existingRate) {
      throw new BadRequestException(
        'Vous devez attendre 1 minute avant de demander un nouveau code',
      );
    }

    // Invalider tous les OTP précédents non utilisés pour cet email et ce type
    await this.invalidateExistingOtp(email, type);

    // Générer un nouveau code OTP
    const otpCode = this.generateSecureOtp();
    const expiryMinutes = this.configService.get<number>(
      'OTP_EXPIRY_MINUTES',
      10,
    );
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Sauvegarder l'OTP en base de données
    await this.prisma.otpCode.create({
      data: {
        email,
        code: otpCode,
        type,
        expiresAt,
      },
    });

    // Envoyer l'email
    const emailType = this.getEmailType(type);
    await this.emailService.sendOtpEmail(email, otpCode, emailType);

    // Définir le rate limiting
    await this.redis.set(rateLimitKey, '1', 60); // 1 minute

    // Stocker temporairement l'OTP dans Redis pour une vérification rapide (optionnel)
    const redisKey = `otp:${email}:${type}`;
    await this.redis.set(redisKey, otpCode, expiryMinutes * 60);

    return {
      success: true,
      message: `Code de vérification envoyé à ${this.maskEmail(email)}`,
    };
  }

  async verifyOtp(
    email: string,
    code: string,
    type: OtpType,
  ): Promise<{ success: boolean; otpId?: string }> {
    // Rechercher l'OTP en base de données
    const otpRecord = await this.prisma.otpCode.findFirst({
      where: {
        email,
        code,
        type,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!otpRecord) {
      // Incrémenter le compteur de tentatives si l'OTP existe
      await this.incrementAttempts(email, type);
      throw new UnauthorizedException(
        'Code de vérification invalide ou expiré',
      );
    }

    // Vérifier le nombre de tentatives
    if (otpRecord.attempts >= 3) {
      throw new UnauthorizedException(
        'Trop de tentatives. Demandez un nouveau code',
      );
    }

    // Marquer l'OTP comme utilisé
    await this.prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    });

    // Supprimer de Redis
    const redisKey = `otp:${email}:${type}`;
    await this.redis.del(redisKey);

    // Nettoyer les anciens OTP pour cet email
    await this.cleanupExpiredOtp(email, type);

    return {
      success: true,
      otpId: otpRecord.id,
    };
  }

  async resendOtp(
    email: string,
    type: OtpType,
  ): Promise<{ success: boolean; message: string }> {
    // Vérifier qu'il existe un OTP non utilisé récent
    const recentOtp = await this.prisma.otpCode.findFirst({
      where: {
        email,
        type,
        isUsed: false,
        createdAt: {
          gt: new Date(Date.now() - 5 * 60 * 1000), // Dans les 5 dernières minutes
        },
      },
    });

    if (!recentOtp) {
      throw new BadRequestException(
        'Aucun code récent trouvé. Veuillez générer un nouveau code',
      );
    }

    if (recentOtp.attempts >= 2) {
      throw new BadRequestException(
        'Trop de tentatives de renvoi. Générez un nouveau code',
      );
    }

    // Renvoyer l'email avec le même code
    const emailType = this.getEmailType(type);
    await this.emailService.sendOtpEmail(email, recentOtp.code, emailType);

    return {
      success: true,
      message: `Code renvoyé à ${this.maskEmail(email)}`,
    };
  }

  private generateSecureOtp(): string {
    const length = this.configService.get<number>('OTP_LENGTH', 6);

    // Utiliser otplib pour générer un code sécurisé
    const secret = authenticator.generateSecret();
    const token = authenticator.generate(secret);

    // Extraire les chiffres nécessaires
    return token.substring(0, length);
  }

  private async invalidateExistingOtp(
    email: string,
    type: OtpType,
  ): Promise<void> {
    await this.prisma.otpCode.updateMany({
      where: {
        email,
        type,
        isUsed: false,
      },
      data: {
        isUsed: true,
      },
    });
  }

  private async incrementAttempts(email: string, type: OtpType): Promise<void> {
    const latestOtp = await this.prisma.otpCode.findFirst({
      where: {
        email,
        type,
        isUsed: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (latestOtp) {
      await this.prisma.otpCode.update({
        where: { id: latestOtp.id },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });
    }
  }

  private async cleanupExpiredOtp(
    email?: string,
    type?: OtpType,
  ): Promise<void> {
    const where: any = {
      OR: [{ expiresAt: { lt: new Date() } }, { isUsed: true }],
    };

    if (email) {
      where.email = email;
    }

    if (type) {
      where.type = type;
    }

    await this.prisma.otpCode.deleteMany({ where });
  }

  private getEmailType(otpType: OtpType): 'verification' | 'login' {
    switch (otpType) {
      case OtpType.EMAIL_VERIFICATION:
        return 'verification';
      case OtpType.LOGIN_VERIFICATION:
        return 'login';
      default:
        return 'verification';
    }
  }

  private maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    const maskedLocal =
      localPart.substring(0, 2) + '*'.repeat(localPart.length - 2);
    return `${maskedLocal}@${domain}`;
  }

  // Méthode pour nettoyer périodiquement les OTP expirés (à appeler via un cron job)
  async cleanupAllExpiredOtp(): Promise<{ deleted: number }> {
    const result = await this.prisma.otpCode.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          {
            isUsed: true,
            createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Plus de 24h
          },
        ],
      },
    });

    return { deleted: result.count };
  }

  // Vérifier la validité d'un OTP sans le marquer comme utilisé
  async isOtpValid(
    email: string,
    code: string,
    type: OtpType,
  ): Promise<boolean> {
    const otpRecord = await this.prisma.otpCode.findFirst({
      where: {
        email,
        code,
        type,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
        attempts: {
          lt: 3,
        },
      },
    });

    return !!otpRecord;
  }
}
