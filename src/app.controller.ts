import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Vérifier le statut de l\'API' })
  @ApiResponse({
    status: 200,
    description: 'API en cours d\'exécution',
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Vérifier la santé de l\'API' })
  @ApiOkResponse({
    description: 'API en bonne santé',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'OK' },
        timestamp: { type: 'string', example: '2024-08-14T18:00:00.000Z' },
      },
    },
  })
  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }
} 