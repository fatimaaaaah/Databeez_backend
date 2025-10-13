import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    description: 'Adresse email ou numéro de téléphone', 
    example: 'khar.kouassi@example.com ou +2250701234567' 
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ description: 'Mot de passe', example: 'MotDePasse123!' })
  @IsString()
  @IsNotEmpty()
  password: string;
} 