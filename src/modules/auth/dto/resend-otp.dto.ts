import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OtpType } from '@prisma/client';

export class ResendOtpDto {
  @ApiProperty({
    description: 'Adresse email pour renvoyer le code OTP',
    example: 'utilisateur@example.com',
  })
  @IsEmail({}, { message: "L'adresse email doit être valide" })
  @IsNotEmpty({ message: "L'adresse email est obligatoire" })
  email: string;

  @ApiProperty({
    description: 'Type de code OTP à renvoyer',
    enum: OtpType,
    example: OtpType.EMAIL_VERIFICATION,
  })
  @IsEnum(OtpType, {
    message:
      'Le type doit être EMAIL_VERIFICATION, PASSWORD_RESET ou LOGIN_VERIFICATION',
  })
  type: OtpType;
}
