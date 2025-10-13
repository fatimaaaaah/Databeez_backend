import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Configuration CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', 'http://localhost:3000'),
    credentials: true,
  });

  // Configuration des pipes de validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configuration Swagger
  setupSwagger(app);

  // Configuration du préfixe global
  app.setGlobalPrefix('api/v1');

  const port = configService.get('PORT', 3000);
  await app.listen(port);
  
  console.log(`🚀 Application Databeez démarrée sur le port ${port}`);
  console.log(`📚 Documentation Swagger disponible sur http://localhost:${port}/api`);
}

bootstrap(); 