import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  motDePasse: string;

  @IsNotEmpty()
  role: string; // 'mentee' ou 'mentor'
}
