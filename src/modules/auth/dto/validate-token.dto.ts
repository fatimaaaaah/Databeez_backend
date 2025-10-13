import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ValidateTokenDto {
  @ApiProperty({
    description: 'Token JWT à valider',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAZXhhbXBsZS5jb20iLCJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE2MTY4NDM4MjJ9.example_signature',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
} 