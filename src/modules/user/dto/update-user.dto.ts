import { PartialType, OmitType } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, MinLength, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['motDePasse', 'role'] as const),
) {
  @ApiPropertyOptional({ description: 'Nouveau mot de passe' })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial',
  })
  motDePasse?: string;

  @ApiPropertyOptional({ description: 'Numéro de téléphone' })
  @IsOptional()
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Le numéro de téléphone doit être au format international (ex: +2250701234567)',
  })
  numeroTelephone?: string;

  @ApiPropertyOptional({ description: 'Nom de famille' })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  nom?: string;

  @ApiPropertyOptional({ description: 'Prénom' })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Le prénom doit contenir au moins 2 caractères' })
  prenom?: string;

  @ApiPropertyOptional({ description: 'Adresse email' })
  @IsOptional()
  @IsEmail({}, { message: 'Format d\'email invalide' })
  email?: string;

  @ApiPropertyOptional({ description: 'URL de la photo de profil' })
  @IsOptional()
  @IsString()
  photoProfil?: string;
} 