import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OtpType } from '@prisma/client';

export class SendOtpDto {
  @ApiProperty({
    description: 'Adresse email pour recevoir le code OTP',
    example: 'utilisateur@example.com',
  })
  @IsEmail({}, { message: "L'adresse email doit être valide" })
  @IsNotEmpty({ message: "L'adresse email est obligatoire" })
  email: string;

  @ApiProperty({
    description: 'Type de code OTP à envoyer',
    enum: OtpType,
    example: OtpType.EMAIL_VERIFICATION,
    default: OtpType.EMAIL_VERIFICATION,
  })
  @IsEnum(OtpType, {
    message:
      'Le type doit être EMAIL_VERIFICATION ou LOGIN_VERIFICATION',
  })
  type: OtpType = OtpType.EMAIL_VERIFICATION;
}
