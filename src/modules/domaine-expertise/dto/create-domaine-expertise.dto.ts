import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDomaineExpertiseDto {
  @ApiProperty({
    description: 'Nom du domaine d\'expertise',
    example: 'Développement Web',
  })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({
    description: 'Description du domaine d\'expertise',
    example: 'Développement d\'applications web modernes avec React, Node.js, etc.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Indique si le domaine est actif',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  actif?: boolean = true;
}