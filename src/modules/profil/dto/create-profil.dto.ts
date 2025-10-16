import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfilDto {
  @ApiProperty({
    description: 'Nom du profil',
    example: 'Développeur Frontend',
  })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({
    description: 'Description du profil',
    example: 'Expert en développement d\'interfaces utilisateur modernes',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'ID du domaine d\'expertise',
    example: 'cm1abc123def456ghi789',
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  domaineExpertiseId: string;
}