import { IsString, IsEmail, IsNotEmpty, MinLength, Matches, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ description: 'Numéro de téléphone', example: '+2250701234567' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Le numéro de téléphone doit être au format international (ex: +2250701234567)',
  })
  numeroTelephone: string;

  @ApiProperty({ description: 'Nom de famille', example: 'Kouassi' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  nom: string;

  @ApiProperty({ description: 'Prénom', example: 'Khar' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Le prénom doit contenir au moins 2 caractères' })
  prenom: string;

  @ApiProperty({ description: 'Adresse email', example: 'khar.kouassi@example.com' })
  @IsEmail({}, { message: 'Format d\'email invalide' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Mot de passe', example: 'MotDePasse123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial',
  })
  motDePasse: string;

  @ApiPropertyOptional({ description: 'Rôle utilisateur', enum: UserRole, default: UserRole.USER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.USER;

  @ApiPropertyOptional({ description: 'URL de la photo de profil' })
  @IsOptional()
  @IsString()
  photoProfil?: string;
} 