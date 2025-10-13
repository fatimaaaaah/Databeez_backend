import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../config/prisma.service';
import { JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    // Vérifier que l'utilisateur existe toujours et est actif
    if (!payload.isActive) {
      throw new UnauthorizedException('Compte désactivé');
    }

    if (!payload.isVerified) {
      throw new UnauthorizedException('Compte non vérifié');
    }

    // Retourner toutes les informations du payload JWT
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      numeroTelephone: payload.numeroTelephone,
      nom: payload.nom,
      prenom: payload.prenom,
      photoProfil: payload.photoProfil,
      dateInscription: payload.dateInscription,
      isActive: payload.isActive,
      isVerified: payload.isVerified,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt
    };
  }
} 