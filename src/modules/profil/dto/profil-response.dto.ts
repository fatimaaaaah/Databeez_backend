import { ApiProperty } from '@nestjs/swagger';
import { DomaineExpertiseResponseDto } from '../../domaine-expertise/dto/domaine-expertise-response.dto';

export class ProfilResponseDto {
  @ApiProperty({
    description: 'ID unique du profil',
    example: 'cm1xyz789abc123def456',
  })
  id: string;

  @ApiProperty({
    description: 'Nom du profil',
    example: 'Développeur Frontend',
  })
  nom: string;

  @ApiProperty({
    description: 'Description du profil',
    example: 'Expert en développement d\'interfaces utilisateur modernes',
  })
  description: string;

  @ApiProperty({
    description: 'ID du domaine d\'expertise',
    example: 'cm1abc123def456ghi789',
  })
  domaineExpertiseId: string;

  @ApiProperty({
    description: 'Domaine d\'expertise associé',
    type: DomaineExpertiseResponseDto,
  })
  domaineExpertise?: DomaineExpertiseResponseDto;

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