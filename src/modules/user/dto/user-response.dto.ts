import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ description: 'Identifiant unique de l\'utilisateur' })
  id: string;

  @ApiProperty({ description: 'Numéro de téléphone' })
  numeroTelephone: string;

  @ApiProperty({ description: 'Nom de famille' })
  nom: string;

  @ApiProperty({ description: 'Prénom' })
  prenom: string;

  @ApiProperty({ description: 'Adresse email' })
  email: string;

  @ApiProperty({ description: 'Rôle de l\'utilisateur', enum: UserRole })
  role: UserRole;

  @ApiPropertyOptional({ description: 'URL de la photo de profil' })
  photoProfil?: string;

  @ApiProperty({ description: 'Date d\'inscription' })
  dateInscription: Date;

  @ApiProperty({ description: 'Statut actif de l\'utilisateur' })
  isActive: boolean;

  @ApiProperty({ description: 'Statut de vérification de l\'utilisateur' })
  isVerified: boolean;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de dernière modification' })
  updatedAt: Date;
}

export class UserProfileDto extends UserResponseDto {
  @ApiPropertyOptional({ description: 'Domaine d\'expertise (pour les mentors)' })
  domaineExpertise?: string;

  @ApiPropertyOptional({ description: 'Années d\'expérience (pour les mentors)' })
  anneesExperience?: number;

  @ApiPropertyOptional({ description: 'Biographie (pour les mentors)' })
  biographie?: string;

  @ApiPropertyOptional({ description: 'Note moyenne (pour les mentors)' })
  noteMoyenne?: number;

  @ApiPropertyOptional({ description: 'Tarif par session (pour les mentors)' })
  tarifParSession?: number;

  @ApiPropertyOptional({ description: 'Objectifs (pour les mentees)' })
  objectifs?: string[];

  @ApiPropertyOptional({ description: 'Compétences actuelles (pour les mentees)' })
  competencesActuelles?: any;

  @ApiPropertyOptional({ description: 'Compétences cibles (pour les mentees)' })
  competencesCible?: any;

  @ApiPropertyOptional({ description: 'Progression (pour les mentees)' })
  progression?: number;
} 