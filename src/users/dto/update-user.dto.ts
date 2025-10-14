import { IsEmail, IsOptional, IsString, MinLength, IsEnum } from 'class-validator';

export enum UserRole {
  MENTOR = 'MENTOR',
  MENTEE = 'MENTEE',
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsEnum(UserRole, { message: 'role doit être MENTOR ou MENTEE' })
  @IsOptional()
  role?: UserRole;
}
