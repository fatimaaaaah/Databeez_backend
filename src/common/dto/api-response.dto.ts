import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ description: 'Statut de la réponse' })
  success: boolean;

  @ApiProperty({ description: 'Message de la réponse' })
  message: string;

  @ApiProperty({ description: 'Données de la réponse' })
  data?: T;

  @ApiProperty({ description: 'Code de statut HTTP' })
  statusCode: number;

  @ApiProperty({ description: 'Timestamp de la réponse' })
  timestamp: string;

  constructor(success: boolean, message: string, data?: T, statusCode: number = 200) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data: T, message: string = 'Opération réussie'): ApiResponseDto<T> {
    return new ApiResponseDto(true, message, data, 200);
  }

  static error(message: string, statusCode: number = 400): ApiResponseDto<null> {
    return new ApiResponseDto(false, message, null, statusCode);
  }
} 