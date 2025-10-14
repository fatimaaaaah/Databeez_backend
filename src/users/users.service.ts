import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Trouver un utilisateur par email
  async findByEmail(email: string) {
    return this.prisma.utilisateur.findUnique({ where: { email } });
  }

  // Trouver un utilisateur par ID avec profil inclus
  async findById(id: string) {
    const user = await this.prisma.utilisateur.findUnique({
      where: { id },
      include: { Mentee: true, Mentor: true }, // inclut le profil
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  // Créer un utilisateur avec profil Mentor ou Mentee
  async createUser(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Création de l'utilisateur
    const user = await this.prisma.utilisateur.create({
      data: {
        email: data.email,
        motDePasse: hashedPassword,
        role: data.role,
      },
    });

    // Création du profil selon le rôle
    if (data.role === UserRole.MENTEE) {
      if (!data.mentee) throw new Error('Données Mentee requises pour ce rôle');
      await this.prisma.mentee.create({
        data: {
          utilisateurId: user.id,
          nom: data.mentee.nom,
          prenom: data.mentee.prenom,
          type: data.mentee.type,
          biographie: data.mentee.biographie || '',
          numeroTelephone: data.mentee.numeroTelephone || '',
          photoProfil: data.mentee.photoProfil || '',
        },
      });
    } else if (data.role === UserRole.MENTOR) {
      if (!data.mentor) throw new Error('Données Mentor requises pour ce rôle');
      await this.prisma.mentor.create({
        data: {
          utilisateurId: user.id,
          domaineExpertise: data.mentor.domaineExpertise,
          anneesExperience: data.mentor.anneesExperience,
          biographie: data.mentor.biographie || '',
          noteMoyenne: data.mentor.noteMoyenne || 0,
          tarifParSession: data.mentor.tarifParSession || 0,
          disponibilites: data.mentor.disponibilites || '',
        },
      });
    }

    // Retourner l'utilisateur avec profil inclus
    return this.prisma.utilisateur.findUnique({
      where: { id: user.id },
      include: { Mentee: true, Mentor: true },
    });
  }

  // Mettre à jour un utilisateur
  async update(userId: string, data: UpdateUserDto) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.utilisateur.update({
      where: { id: userId },
      data: {
        email: data.email,
        motDePasse: data.password,
        role: data.role,
      },
    });
  }

  // Récupérer tous les utilisateurs avec profils
  async getAll() {
    return this.prisma.utilisateur.findMany({
      include: { Mentee: true, Mentor: true },
    });
  }
}
