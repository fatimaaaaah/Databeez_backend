import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../config/prisma.service';
import { RedisService } from '../../config/redis.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { JwtPayload } from './types/jwt-payload.type';
import { RegisterWithOtpDto } from './dto/register-with-otp.dto';
import { LoginWithOtpDto } from './dto/login-with-otp.dto';
import { OtpService } from './services/otp.service';
import { OtpType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
    private redis: RedisService,
    private userService: UserService,
    private otpService: OtpService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    // Créer l'utilisateur
    const user = await this.userService.create(createUserDto);

    // Générer les tokens
    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { identifier, password } = loginDto;

    // Trouver l'utilisateur par email ou téléphone
    const user = await this.findUserByIdentifier(identifier);

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.motDePasse);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Vérifier le statut du compte
    if (!user.isActive) {
      throw new UnauthorizedException('Compte désactivé');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Compte non vérifié');
    }

    // Générer les tokens
    const tokens = await this.generateTokens(user);

    // Stocker le refresh token dans Redis
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: this.userService.mapToUserResponse(user),
    };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    try {
      // Vérifier le refresh token
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      // Vérifier si le token est dans Redis
      const storedToken = await this.redis.get(`refresh_token:${payload.sub}`);
      if (!storedToken || storedToken !== refreshTokenDto.refreshToken) {
        throw new UnauthorizedException('Token de rafraîchissement invalide');
      }

      // Récupérer l'utilisateur
      const user = await this.userService.findOne(payload.sub);

      // Générer de nouveaux tokens
      const tokens = await this.generateTokens(user);

      // Mettre à jour le refresh token dans Redis
      await this.storeRefreshToken(user.id, tokens.refreshToken);

      return {
        ...tokens,
        user,
      };
    } catch (error) {
      throw new UnauthorizedException('Token de rafraîchissement invalide');
    }
  }

  async logout(userId: string): Promise<void> {
    // Supprimer le refresh token de Redis
    await this.redis.del(`refresh_token:${userId}`);
  }

  async validateToken(token: string): Promise<{ valid: boolean; user?: any }> {
    try {
      // Vérifier le token JWT
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      // Vérifier que l'utilisateur existe toujours
      const user = await this.userService.findOne(payload.sub);
      if (!user || !user.isActive) {
        return { valid: false };
      }

      return { valid: true, user };
    } catch (error) {
      return { valid: false };
    }
  }

  async validateUser(identifier: string, password: string): Promise<any> {
    const user = await this.findUserByIdentifier(identifier);

    if (user && (await bcrypt.compare(password, user.motDePasse))) {
      return user;
    }

    return null;
  }

  private async findUserByIdentifier(identifier: string): Promise<any> {
    // Vérifier si c'est un email ou un numéro de téléphone
    const isEmail = identifier.includes('@');

    if (isEmail) {
      return await this.prisma.user.findUnique({
        where: { email: identifier },
      });
    } else {
      return await this.prisma.user.findUnique({
        where: { numeroTelephone: identifier },
      });
    }
  }

  private async generateTokens(user: any) {
    // Créer un payload riche avec toutes les informations utilisateur (sauf l'ID)
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      numeroTelephone: user.numeroTelephone,
      nom: user.nom,
      prenom: user.prenom,
      photoProfil: user.photoProfil,
      dateInscription: user.dateInscription,
      isActive: user.isActive,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN', '7d'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '30d'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.getTokenExpirationInSeconds(
        this.configService.get('JWT_EXPIRES_IN', '7d'),
      ),
    };
  }

  private async storeRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const expiresIn = this.getTokenExpirationInSeconds(
      this.configService.get('JWT_REFRESH_EXPIRES_IN', '30d'),
    );

    await this.redis.set(`refresh_token:${userId}`, refreshToken, expiresIn);
  }

  private getTokenExpirationInSeconds(expiration: string): number {
    const unit = expiration.slice(-1);
    const value = parseInt(expiration.slice(0, -1));

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return 7 * 24 * 60 * 60; // 7 jours par défaut
    }
  }

  // ==================== MÉTHODES OTP ====================

  async sendOtp(
    email: string,
    type: OtpType,
  ): Promise<{ success: boolean; message: string }> {
    return await this.otpService.generateAndSendOtp(email, type);
  }


  async resendOtp(
    email: string,
    type: OtpType,
  ): Promise<{ success: boolean; message: string }> {
    return await this.otpService.resendOtp(email, type);
  }

  async registerWithOtp(
    registerWithOtpDto: RegisterWithOtpDto,
  ): Promise<AuthResponseDto> {
    const { otpCode, ...createUserDto } = registerWithOtpDto;

    // Vérifier le code OTP
    const otpVerification = await this.otpService.verifyOtp(
      createUserDto.email,
      otpCode,
      OtpType.EMAIL_VERIFICATION,
    );

    if (!otpVerification.success) {
      throw new UnauthorizedException('Code de vérification invalide');
    }

    // Créer l'utilisateur avec le statut vérifié
    const userData = {
      ...createUserDto,
      isVerified: true, // L'utilisateur est automatiquement vérifié avec l'OTP
    };

    const user = await this.userService.create(userData);

    // Générer les tokens
    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user,
    };
  }

  async loginWithOtp(
    loginWithOtpDto: LoginWithOtpDto,
  ): Promise<AuthResponseDto> {
    const { email, otpCode } = loginWithOtpDto;

    // Vérifier le code OTP
    const otpVerification = await this.otpService.verifyOtp(
      email,
      otpCode,
      OtpType.LOGIN_VERIFICATION,
    );

    if (!otpVerification.success) {
      throw new UnauthorizedException('Code de connexion invalide');
    }

    // Trouver l'utilisateur
    const user = await this.findUserByIdentifier(email);
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    // Vérifier le statut du compte
    if (!user.isActive) {
      throw new UnauthorizedException('Compte désactivé');
    }

    // Générer les tokens
    const tokens = await this.generateTokens(user);

    // Stocker le refresh token dans Redis
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: this.userService.mapToUserResponse(user),
    };
  }

}
