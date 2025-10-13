import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../user/dto/user-response.dto';

export class AuthResponseDto {
  @ApiProperty({ description: 'Token d\'accès JWT' })
  accessToken: string;

  @ApiProperty({ description: 'Token de rafraîchissement' })
  refreshToken: string;

  @ApiProperty({ description: 'Expiration du token d\'accès (en secondes)' })
  expiresIn: number;

  @ApiProperty({ description: 'Informations de l\'utilisateur' })
  user: UserResponseDto;
} 