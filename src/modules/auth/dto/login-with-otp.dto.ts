import { IsEmail, IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginWithOtpDto {
  @ApiProperty({
    description: "Adresse email de l'utilisateur",
    example: 'utilisateur@example.com',
  })
  @IsEmail({}, { message: "L'adresse email doit être valide" })
  @IsNotEmpty({ message: "L'adresse email est obligatoire" })
  email: string;

  @ApiProperty({
    description: 'Code OTP de connexion',
    example: '123456',
    minLength: 4,
    maxLength: 8,
  })
  @IsString({ message: 'Le code OTP doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le code OTP est obligatoire' })
  @Length(4, 8, {
    message: 'Le code OTP doit contenir entre 4 et 8 caractères',
  })
  otpCode: string;
}
