import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from '../../user/dto/create-user.dto';

export class RegisterWithOtpDto extends CreateUserDto {
  @ApiProperty({
    description: "Code OTP de vérification d'email",
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
