import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateMentoratDto } from './dto/create-mentorat.dto';
import { UpdateMentoratDto } from './dto/update-mentorat.dto';
import { MentoratResponseDto } from './dto/mentorat-response.dto';

@Injectable()
export class MentoratService {
  constructor(private prisma: PrismaService) {}

  async create(createMentoratDto: CreateMentoratDto): Promise<MentoratResponseDto> {
    // Vérifier que le mentor existe
    const mentor = await this.prisma.mentor.findUnique({
      where: { id: createMentoratDto.mentorId },
    });

    if (!mentor) {
      throw new NotFoundException('Mentor introuvable');
    }

    // Vérifier que le mentee existe
    const mentee = await this.prisma.mentee.findUnique({
      where: { id: createMentoratDto.menteeId },
    });

    if (!mentee) {
      throw new NotFoundException('Mentoré introuvable');
    }

    // Vérifier que le profil existe
    const profil = await this.prisma.profil.findUnique({
      where: { id: createMentoratDto.profilId },
    });

    if (!profil) {
      throw new NotFoundException('Profil introuvable');
    }

    // Vérifier qu'un mentorat actif n'existe pas déjà entre ces deux utilisateurs
    const existingMentorat = await this.prisma.mentorat.findFirst({
      where: {
        mentorId: createMentoratDto.mentorId,
        menteeId: createMentoratDto.menteeId,
        statut: { in: ['ACTIF', 'EN_ATTENTE'] },
      },
    });

    if (existingMentorat) {
      throw new ConflictException('Un mentorat actif existe déjà entre ces utilisateurs');
    }

    // Vérifier les dates
    if (createMentoratDto.dateDebut && createMentoratDto.dateFin) {
      if (new Date(createMentoratDto.dateDebut) >= new Date(createMentoratDto.dateFin)) {
        throw new BadRequestException('La date de début doit être antérieure à la date de fin');
      }
    }

    const mentorat = await this.prisma.mentorat.create({
      data: createMentoratDto,
      include: {
        mentor: {
          include: {
            utilisateur: true,
          },
        },
        mentee: {
          include: {
            utilisateur: true,
          },
        },
        profil: {
          include: {
            domaineExpertise: true,
          },
        },
      },
    });

    return this.mapToResponseDto(mentorat);
  }

  async findAll(): Promise<MentoratResponseDto[]> {
    const mentorats = await this.prisma.mentorat.findMany({
      include: {
        mentor: {
          include: {
            utilisateur: true,
          },
        },
        mentee: {
          include: {
            utilisateur: true,
          },
        },
        profil: {
          include: {
            domaineExpertise: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return mentorats.map(mentorat => this.mapToResponseDto(mentorat));
  }

  async findByMentor(mentorId: string): Promise<MentoratResponseDto[]> {
    const mentorats = await this.prisma.mentorat.findMany({
      where: { mentorId },
      include: {
        mentor: {
          include: {
            utilisateur: true,
          },
        },
        mentee: {
          include: {
            utilisateur: true,
          },
        },
        profil: {
          include: {
            domaineExpertise: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return mentorats.map(mentorat => this.mapToResponseDto(mentorat));
  }

  async findByMentee(menteeId: string): Promise<MentoratResponseDto[]> {
    const mentorats = await this.prisma.mentorat.findMany({
      where: { menteeId },
      include: {
        mentor: {
          include: {
            utilisateur: true,
          },
        },
        mentee: {
          include: {
            utilisateur: true,
          },
        },
        profil: {
          include: {
            domaineExpertise: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return mentorats.map(mentorat => this.mapToResponseDto(mentorat));
  }

  async findByStatut(statut: string): Promise<MentoratResponseDto[]> {
    const mentorats = await this.prisma.mentorat.findMany({
      where: { statut },
      include: {
        mentor: {
          include: {
            utilisateur: true,
          },
        },
        mentee: {
          include: {
            utilisateur: true,
          },
        },
        profil: {
          include: {
            domaineExpertise: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return mentorats.map(mentorat => this.mapToResponseDto(mentorat));
  }

  async findOne(id: string): Promise<MentoratResponseDto> {
    const mentorat = await this.prisma.mentorat.findUnique({
      where: { id },
      include: {
        mentor: {
          include: {
            utilisateur: true,
          },
        },
        mentee: {
          include: {
            utilisateur: true,
          },
        },
        profil: {
          include: {
            domaineExpertise: true,
          },
        },
      },
    });

    if (!mentorat) {
      throw new NotFoundException('Mentorat introuvable');
    }

    return this.mapToResponseDto(mentorat);
  }

  async update(id: string, updateMentoratDto: UpdateMentoratDto): Promise<MentoratResponseDto> {
    // Vérifier que le mentorat existe
    await this.findOne(id);

    // Si le mentor est modifié, vérifier qu'il existe
    if (updateMentoratDto.mentorId) {
      const mentor = await this.prisma.mentor.findUnique({
        where: { id: updateMentoratDto.mentorId },
      });

      if (!mentor) {
        throw new NotFoundException('Mentor introuvable');
      }
    }

    // Si le mentee est modifié, vérifier qu'il existe
    if (updateMentoratDto.menteeId) {
      const mentee = await this.prisma.mentee.findUnique({
        where: { id: updateMentoratDto.menteeId },
      });

      if (!mentee) {
        throw new NotFoundException('Mentoré introuvable');
      }
    }

    // Si le profil est modifié, vérifier qu'il existe
    if (updateMentoratDto.profilId) {
      const profil = await this.prisma.profil.findUnique({
        where: { id: updateMentoratDto.profilId },
      });

      if (!profil) {
        throw new NotFoundException('Profil introuvable');
      }
    }

    // Vérifier les dates si elles sont modifiées
    if (updateMentoratDto.dateDebut || updateMentoratDto.dateFin) {
      const currentMentorat = await this.prisma.mentorat.findUnique({
        where: { id },
      });

      const dateDebut = updateMentoratDto.dateDebut || currentMentorat.dateDebut;
      const dateFin = updateMentoratDto.dateFin || currentMentorat.dateFin;

      if (dateDebut && dateFin && new Date(dateDebut) >= new Date(dateFin)) {
        throw new BadRequestException('La date de début doit être antérieure à la date de fin');
      }
    }

    const mentorat = await this.prisma.mentorat.update({
      where: { id },
      data: updateMentoratDto,
      include: {
        mentor: {
          include: {
            utilisateur: true,
          },
        },
        mentee: {
          include: {
            utilisateur: true,
          },
        },
        profil: {
          include: {
            domaineExpertise: true,
          },
        },
      },
    });

    return this.mapToResponseDto(mentorat);
  }

  async remove(id: string): Promise<void> {
    // Vérifier que le mentorat existe
    await this.findOne(id);

    await this.prisma.mentorat.delete({
      where: { id },
    });
  }

  private mapToResponseDto(mentorat: any): MentoratResponseDto {
    return {
      id: mentorat.id,
      mentorId: mentorat.mentorId,
      menteeId: mentorat.menteeId,
      profilId: mentorat.profilId,
      statut: mentorat.statut,
      dateDebut: mentorat.dateDebut,
      dateFin: mentorat.dateFin,
      description: mentorat.description,
      mentor: mentorat.mentor ? {
        id: mentorat.mentor.id,
        utilisateurId: mentorat.mentor.utilisateurId,
        utilisateur: mentorat.mentor.utilisateur ? {
          id: mentorat.mentor.utilisateur.id,
          nom: mentorat.mentor.utilisateur.nom,
          prenom: mentorat.mentor.utilisateur.prenom,
          email: mentorat.mentor.utilisateur.email,
        } : undefined,
        secteurActivite: mentorat.mentor.secteurActivite,
        experienceAnnees: mentorat.mentor.experienceAnnees,
        bio: mentorat.mentor.bio,
        tarifs: mentorat.mentor.tarifs,
        actif: mentorat.mentor.actif,
        createdAt: mentorat.mentor.createdAt,
        updatedAt: mentorat.mentor.updatedAt,
      } : undefined,
      mentee: mentorat.mentee ? {
        id: mentorat.mentee.id,
        utilisateurId: mentorat.mentee.utilisateurId,
        utilisateur: mentorat.mentee.utilisateur ? {
          id: mentorat.mentee.utilisateur.id,
          nom: mentorat.mentee.utilisateur.nom,
          prenom: mentorat.mentee.utilisateur.prenom,
          email: mentorat.mentee.utilisateur.email,
        } : undefined,
        secteurActivite: mentorat.mentee.secteurActivite,
        objectifs: mentorat.mentee.objectifs,
        createdAt: mentorat.mentee.createdAt,
        updatedAt: mentorat.mentee.updatedAt,
      } : undefined,
      profil: mentorat.profil ? {
        id: mentorat.profil.id,
        nom: mentorat.profil.nom,
        description: mentorat.profil.description,
        domaineExpertiseId: mentorat.profil.domaineExpertiseId,
        domaineExpertise: mentorat.profil.domaineExpertise ? {
          id: mentorat.profil.domaineExpertise.id,
          nom: mentorat.profil.domaineExpertise.nom,
          description: mentorat.profil.domaineExpertise.description,
          actif: mentorat.profil.domaineExpertise.actif,
          createdAt: mentorat.profil.domaineExpertise.createdAt,
          updatedAt: mentorat.profil.domaineExpertise.updatedAt,
        } : undefined,
        createdAt: mentorat.profil.createdAt,
        updatedAt: mentorat.profil.updatedAt,
      } : undefined,
      createdAt: mentorat.createdAt,
      updatedAt: mentorat.updatedAt,
    };
  }
}