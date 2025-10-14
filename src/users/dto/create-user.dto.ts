// create-user.dto.ts
import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsNumber } from 'class-validator';

export enum UserRole {
  MENTOR = 'MENTOR',
  MENTEE = 'MENTEE',
}

// DTO pour les informations spécifiques à un Mentee
export class CreateMenteeDto {
  @IsString() nom: string;
  @IsString() prenom: string;
  @IsString() type: string;
  @IsString() @IsOptional() biographie?: string;
  @IsString() @IsOptional() numeroTelephone?: string;
  @IsString() @IsOptional() photoProfil?: string;
}

// DTO pour les informations spécifiques à un Mentor
export class CreateMentorDto {
  @IsString() domaineExpertise: string;
  @IsNumber() anneesExperience: number;
  @IsString() @IsOptional() biographie?: string;
  @IsNumber() @IsOptional() noteMoyenne?: number;
  @IsNumber() @IsOptional() tarifParSession?: number;
  @IsString() @IsOptional() disponibilites?: string;
}

// DTO principal pour la création d'un utilisateur
export class CreateUserDto {
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
  @IsEnum(UserRole) role: UserRole;

  @IsOptional() mentee?: CreateMenteeDto;
  @IsOptional() mentor?: CreateMentorDto;
}
