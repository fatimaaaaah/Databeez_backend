import { IsEmail, IsNotEmpty, IsString, Length, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OtpType } from '@prisma/client';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Adresse email associée au code OTP',
    example: 'utilisateur@example.com',
  })
  @IsEmail({}, { message: "L'adresse email doit être valide" })
  @IsNotEmpty({ message: "L'adresse email est obligatoire" })
  email: string;

  @ApiProperty({
    description: 'Code OTP à vérifier',
    example: '123456',
    minLength: 4,
    maxLength: 8,
  })
  @IsString({ message: 'Le code doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le code OTP est obligatoire' })
  @Length(4, 8, { message: 'Le code doit contenir entre 4 et 8 caractères' })
  code: string;

  @ApiProperty({
    description: 'Type de code OTP à vérifier',
    enum: OtpType,
    example: OtpType.EMAIL_VERIFICATION,
  })
  @IsEnum(OtpType, {
    message:
      'Le type doit être EMAIL_VERIFICATION, PASSWORD_RESET ou LOGIN_VERIFICATION',
  })
  type: OtpType;
}
