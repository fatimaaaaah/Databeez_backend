import { ApiProperty } from '@nestjs/swagger';
import { ProfilResponseDto } from '../../profil/dto/profil-response.dto';

export class MentoratResponseDto {
  @ApiProperty({
    description: 'ID unique du mentorat',
    example: 'cm1ghi789def456abc123',
  })
  id: string;

  @ApiProperty({
    description: 'ID du mentee',
    example: 'cm1def456ghi789abc123',
  })
  menteeId: string;

  @ApiProperty({
    description: 'ID du profil',
    example: 'cm1xyz789abc123def456',
  })
  profilId: string;

  @ApiProperty({
    description: 'Objectif du mentorat',
    example: 'Apprendre React et devenir développeur frontend',
  })
  objectif: string;

  @ApiProperty({
    description: 'Date de début du mentorat',
    example: '2024-01-15T00:00:00.000Z',
  })
  dateDebut: Date;

  @ApiProperty({
    description: 'Date de fin du mentorat',
    example: '2024-06-15T00:00:00.000Z',
    required: false,
  })
  dateFin?: Date;

  @ApiProperty({
    description: 'Données personnalisées',
    example: 'Notes supplémentaires sur le mentorat',
    required: false,
  })
  customData?: string;

  @ApiProperty({
    description: 'Statut du mentorat',
    example: 'EN_COURS',
  })
  statut: string;

  @ApiProperty({
    description: 'Profil associé',
    type: ProfilResponseDto,
  })
  profil?: ProfilResponseDto;

  @ApiProperty({
    description: 'Date de création',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière modification',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}