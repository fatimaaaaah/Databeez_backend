import { IsString, IsNotEmpty, IsUUID, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMentoratDto {
  @ApiProperty({
    description: 'ID du mentee',
    example: 'cm1def456ghi789abc123',
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  menteeId: string;

  @ApiProperty({
    description: 'ID du profil',
    example: 'cm1xyz789abc123def456',
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  profilId: string;

  @ApiProperty({
    description: 'Objectif du mentorat',
    example: 'Apprendre React et devenir développeur frontend',
  })
  @IsString()
  @IsNotEmpty()
  objectif: string;

  @ApiProperty({
    description: 'Date de début du mentorat',
    example: '2024-01-15T00:00:00.000Z',
  })
  @IsDateString()
  dateDebut: string;

  @ApiProperty({
    description: 'Date de fin du mentorat (optionnelle)',
    example: '2024-06-15T00:00:00.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dateFin?: string;

  @ApiProperty({
    description: 'Données personnalisées (optionnelles)',
    example: 'Notes supplémentaires sur le mentorat',
    required: false,
  })
  @IsString()
  @IsOptional()
  customData?: string;

  @ApiProperty({
    description: 'Statut du mentorat',
    example: 'EN_COURS',
    default: 'EN_COURS',
  })
  @IsString()
  @IsOptional()
  statut?: string = 'EN_COURS';
}