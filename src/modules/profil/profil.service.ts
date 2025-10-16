import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateProfilDto } from './dto/create-profil.dto';
import { UpdateProfilDto } from './dto/update-profil.dto';
import { ProfilResponseDto } from './dto/profil-response.dto';

@Injectable()
export class ProfilService {
  constructor(private prisma: PrismaService) {}

  async create(createProfilDto: CreateProfilDto): Promise<ProfilResponseDto> {
    // Vérifier que le domaine d'expertise existe
    const domaineExpertise = await this.prisma.domaineExpertise.findUnique({
      where: { id: createProfilDto.domaineExpertiseId },
    });

    if (!domaineExpertise) {
      throw new NotFoundException('Domaine d\'expertise introuvable');
    }

    // Vérifier si un profil avec ce nom existe déjà dans ce domaine
    const existingProfil = await this.prisma.profil.findFirst({
      where: {
        nom: createProfilDto.nom,
        domaineExpertiseId: createProfilDto.domaineExpertiseId,
      },
    });

    if (existingProfil) {
      throw new ConflictException('Un profil avec ce nom existe déjà dans ce domaine d\'expertise');
    }

    const profil = await this.prisma.profil.create({
      data: createProfilDto,
      include: {
        domaineExpertise: true,
      },
    });

    return this.mapToResponseDto(profil);
  }

  async findAll(): Promise<ProfilResponseDto[]> {
    const profils = await this.prisma.profil.findMany({
      include: {
        domaineExpertise: true,
      },
      orderBy: { nom: 'asc' },
    });

    return profils.map(profil => this.mapToResponseDto(profil));
  }

  async findByDomaineExpertise(domaineExpertiseId: string): Promise<ProfilResponseDto[]> {
    const profils = await this.prisma.profil.findMany({
      where: { domaineExpertiseId },
      include: {
        domaineExpertise: true,
      },
      orderBy: { nom: 'asc' },
    });

    return profils.map(profil => this.mapToResponseDto(profil));
  }

  async findOne(id: string): Promise<ProfilResponseDto> {
    const profil = await this.prisma.profil.findUnique({
      where: { id },
      include: {
        domaineExpertise: true,
        competences: true,
      },
    });

    if (!profil) {
      throw new NotFoundException('Profil introuvable');
    }

    return this.mapToResponseDto(profil);
  }

  async update(id: string, updateProfilDto: UpdateProfilDto): Promise<ProfilResponseDto> {
    // Vérifier que le profil existe
    await this.findOne(id);

    // Si le domaine d'expertise est modifié, vérifier qu'il existe
    if (updateProfilDto.domaineExpertiseId) {
      const domaineExpertise = await this.prisma.domaineExpertise.findUnique({
        where: { id: updateProfilDto.domaineExpertiseId },
      });

      if (!domaineExpertise) {
        throw new NotFoundException('Domaine d\'expertise introuvable');
      }
    }

    // Si le nom est modifié, vérifier qu'il n'existe pas déjà dans le domaine
    if (updateProfilDto.nom || updateProfilDto.domaineExpertiseId) {
      const currentProfil = await this.prisma.profil.findUnique({
        where: { id },
      });

      const nomToCheck = updateProfilDto.nom || currentProfil.nom;
      const domaineToCheck = updateProfilDto.domaineExpertiseId || currentProfil.domaineExpertiseId;

      const existingProfil = await this.prisma.profil.findFirst({
        where: {
          nom: nomToCheck,
          domaineExpertiseId: domaineToCheck,
          id: { not: id },
        },
      });

      if (existingProfil) {
        throw new ConflictException('Un profil avec ce nom existe déjà dans ce domaine d\'expertise');
      }
    }

    const profil = await this.prisma.profil.update({
      where: { id },
      data: updateProfilDto,
      include: {
        domaineExpertise: true,
      },
    });

    return this.mapToResponseDto(profil);
  }

  async remove(id: string): Promise<void> {
    // Vérifier que le profil existe
    await this.findOne(id);

    // Vérifier qu'aucun mentorat n'utilise ce profil
    const mentoratCount = await this.prisma.mentorat.count({
      where: { profilId: id },
    });

    if (mentoratCount > 0) {
      throw new ConflictException('Impossible de supprimer ce profil car il est utilisé par des mentorats');
    }

    await this.prisma.profil.delete({
      where: { id },
    });
  }

  private mapToResponseDto(profil: any): ProfilResponseDto {
    return {
      id: profil.id,
      nom: profil.nom,
      description: profil.description,
      domaineExpertiseId: profil.domaineExpertiseId,
      domaineExpertise: profil.domaineExpertise ? {
        id: profil.domaineExpertise.id,
        nom: profil.domaineExpertise.nom,
        description: profil.domaineExpertise.description,
        actif: profil.domaineExpertise.actif,
        createdAt: profil.domaineExpertise.createdAt,
        updatedAt: profil.domaineExpertise.updatedAt,
      } : undefined,
      createdAt: profil.createdAt,
      updatedAt: profil.updatedAt,
    };
  }
}