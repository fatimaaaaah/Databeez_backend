import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { RedisService } from '../../config/redis.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto, UserProfileDto } from './dto/user-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: createUserDto.email },
          { numeroTelephone: createUserDto.numeroTelephone },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email ou numéro de téléphone existe déjà');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(createUserDto.motDePasse, 12);

    // Créer l'utilisateur
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        motDePasse: hashedPassword,
      },
    });

    // Invalider le cache
    await this.redis.del(`user:${user.id}`);

    return this.mapToUserResponse(user);
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    // Construire la clause where
    const where = search ? {
      OR: [
        { nom: { contains: search, mode: 'insensitive' as any } },
        { prenom: { contains: search, mode: 'insensitive' as any } },
        { email: { contains: search, mode: 'insensitive' as any } },
        { numeroTelephone: { contains: search, mode: 'insensitive' as any } },
      ],
    } : {};

    // Compter le total
    const total = await this.prisma.user.count({ where });

    // Récupérer les utilisateurs
    const users = await this.prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: users.map(user => this.mapToUserResponse(user)),
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async findOne(id: string): Promise<UserProfileDto> {
    // Vérifier le cache
    const cachedUser = await this.redis.get(`user:${id}`);
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        mentor: true,
        mentee: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }

    const userProfile = this.mapToUserProfile(user);
    
    // Mettre en cache pour 5 minutes
    await this.redis.set(`user:${id}`, JSON.stringify(userProfile), 300);

    return userProfile;
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? this.mapToUserResponse(user) : null;
  }

  async findByPhone(numeroTelephone: string): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { numeroTelephone },
    });

    return user ? this.mapToUserResponse(user) : null;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    // Vérifier si l'utilisateur existe
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }

    // Vérifier les conflits si email ou téléphone modifiés
    if (updateUserDto.email || updateUserDto.numeroTelephone) {
      const conflictUser = await this.prisma.user.findFirst({
        where: {
          OR: [
            ...(updateUserDto.email ? [{ email: updateUserDto.email }] : []),
            ...(updateUserDto.numeroTelephone ? [{ numeroTelephone: updateUserDto.numeroTelephone }] : []),
          ],
          NOT: { id },
        },
      });

      if (conflictUser) {
        throw new ConflictException('Un utilisateur avec cet email ou numéro de téléphone existe déjà');
      }
    }

    // Hasher le nouveau mot de passe si fourni
    let hashedPassword: string | undefined;
    if (updateUserDto.motDePasse) {
      hashedPassword = await bcrypt.hash(updateUserDto.motDePasse, 12);
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        ...(hashedPassword && { motDePasse: hashedPassword }),
      },
    });

    // Invalider le cache
    await this.redis.del(`user:${id}`);

    return this.mapToUserResponse(updatedUser);
  }

  async remove(id: string): Promise<void> {
    // Vérifier si l'utilisateur existe
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }

    // Supprimer l'utilisateur
    await this.prisma.user.delete({
      where: { id },
    });

    // Invalider le cache
    await this.redis.del(`user:${id}`);
  }

  async verifyUser(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { isVerified: true },
    });

    // Invalider le cache
    await this.redis.del(`user:${id}`);

    return this.mapToUserResponse(user);
  }

  async deactivateUser(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    // Invalider le cache
    await this.redis.del(`user:${id}`);

    return this.mapToUserResponse(user);
  }

  async activateUser(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive: true },
    });

    // Invalider le cache
    await this.redis.del(`user:${id}`);

    return this.mapToUserResponse(user);
  }

  mapToUserResponse(user: any): UserResponseDto {
    return {
      id: user.id,
      numeroTelephone: user.numeroTelephone,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      photoProfil: user.photoProfil,
      dateInscription: user.dateInscription,
      isActive: user.isActive,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private mapToUserProfile(user: any): UserProfileDto {
    const baseUser = this.mapToUserResponse(user);
    
    return {
      ...baseUser,
      domaineExpertise: user.mentor?.domaineExpertise,
      anneesExperience: user.mentor?.anneesExperience,
      biographie: user.mentor?.biographie,
      noteMoyenne: user.mentor?.noteMoyenne,
      tarifParSession: user.mentor?.tarifParSession,
      objectifs: user.mentee?.objectifs,
      competencesActuelles: user.mentee?.competencesActuelles,
      competencesCible: user.mentee?.competencesCible,
      progression: user.mentee?.progression,
    };
  }
} 