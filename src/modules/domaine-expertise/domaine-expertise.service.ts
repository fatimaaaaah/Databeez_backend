import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateDomaineExpertiseDto } from './dto/create-domaine-expertise.dto';
import { UpdateDomaineExpertiseDto } from './dto/update-domaine-expertise.dto';
import { DomaineExpertiseResponseDto } from './dto/domaine-expertise-response.dto';

@Injectable()
export class DomaineExpertiseService {
  constructor(private prisma: PrismaService) {}

  async create(createDomaineExpertiseDto: CreateDomaineExpertiseDto): Promise<DomaineExpertiseResponseDto> {
    // Vérifier si le nom existe déjà
    const existingDomaine = await this.prisma.domaineExpertise.findUnique({
      where: { nom: createDomaineExpertiseDto.nom },
    });

    if (existingDomaine) {
      throw new ConflictException('Un domaine d\'expertise avec ce nom existe déjà');
    }

    const domaine = await this.prisma.domaineExpertise.create({
      data: createDomaineExpertiseDto,
    });

    return this.mapToResponseDto(domaine);
  }

  async findAll(): Promise<DomaineExpertiseResponseDto[]> {
    const domaines = await this.prisma.domaineExpertise.findMany({
      orderBy: { nom: 'asc' },
    });

    return domaines.map(domaine => this.mapToResponseDto(domaine));
  }

  async findAllActive(): Promise<DomaineExpertiseResponseDto[]> {
    const domaines = await this.prisma.domaineExpertise.findMany({
      where: { actif: true },
      orderBy: { nom: 'asc' },
    });

    return domaines.map(domaine => this.mapToResponseDto(domaine));
  }

  async findOne(id: string): Promise<DomaineExpertiseResponseDto> {
    const domaine = await this.prisma.domaineExpertise.findUnique({
      where: { id },
    });

    if (!domaine) {
      throw new NotFoundException('Domaine d\'expertise introuvable');
    }

    return this.mapToResponseDto(domaine);
  }

  async update(id: string, updateDomaineExpertiseDto: UpdateDomaineExpertiseDto): Promise<DomaineExpertiseResponseDto> {
    // Vérifier que le domaine existe
    await this.findOne(id);

    // Si le nom est modifié, vérifier qu'il n'existe pas déjà
    if (updateDomaineExpertiseDto.nom) {
      const existingDomaine = await this.prisma.domaineExpertise.findFirst({
        where: {
          nom: updateDomaineExpertiseDto.nom,
          id: { not: id },
        },
      });

      if (existingDomaine) {
        throw new ConflictException('Un domaine d\'expertise avec ce nom existe déjà');
      }
    }

    const domaine = await this.prisma.domaineExpertise.update({
      where: { id },
      data: updateDomaineExpertiseDto,
    });

    return this.mapToResponseDto(domaine);
  }

  async remove(id: string): Promise<void> {
    // Vérifier que le domaine existe
    await this.findOne(id);

    // Vérifier qu'aucun profil n'utilise ce domaine
    const profilsCount = await this.prisma.profil.count({
      where: { domaineExpertiseId: id },
    });

    if (profilsCount > 0) {
      throw new ConflictException('Impossible de supprimer ce domaine d\'expertise car il est utilisé par des profils');
    }

    await this.prisma.domaineExpertise.delete({
      where: { id },
    });
  }

  private mapToResponseDto(domaine: any): DomaineExpertiseResponseDto {
    return {
      id: domaine.id,
      nom: domaine.nom,
      description: domaine.description,
      actif: domaine.actif,
      createdAt: domaine.createdAt,
      updatedAt: domaine.updatedAt,
    };
  }
}