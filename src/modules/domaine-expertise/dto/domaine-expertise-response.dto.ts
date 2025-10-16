import { ApiProperty } from '@nestjs/swagger';

export class DomaineExpertiseResponseDto {
  @ApiProperty({
    description: 'ID unique du domaine d\'expertise',
    example: 'cm1abc123def456ghi789',
  })
  id: string;

  @ApiProperty({
    description: 'Nom du domaine d\'expertise',
    example: 'Développement Web',
  })
  nom: string;

  @ApiProperty({
    description: 'Description du domaine d\'expertise',
    example: 'Développement d\'applications web modernes avec React, Node.js, etc.',
  })
  description: string;

  @ApiProperty({
    description: 'Indique si le domaine est actif',
    example: true,
  })
  actif: boolean;

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