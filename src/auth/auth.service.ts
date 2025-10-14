import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Valider un utilisateur (connexion interne)
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.motDePasse))) {
      const { motDePasse, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  // Enregistrer un nouvel utilisateur
  async register(dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  // Connexion + génération JWT
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.motDePasse))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  // Rafraîchir le JWT (exemple simple, tu peux améliorer avec refreshToken)
  async refresh(refreshToken: string) {
    // Ici tu peux vérifier la validité du refreshToken et générer un nouveau JWT
    // Pour l'instant on retourne juste un message
    return { message: 'Refresh token logic to implement' };
  }

  // Déconnexion + blacklist JWT
  async logout(user: any) {
    // Ici tu peux ajouter le token dans une blacklist ou l’invalider côté client
    return { message: `User ${user.email} logged out successfully` };
  }
}
