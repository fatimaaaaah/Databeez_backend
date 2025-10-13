import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';

// Modules de l'application
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

// Configuration
import { DatabaseModule } from './config/database.module';
import { RedisModule } from './config/redis.module';

// Application
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Configuration globale
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Protection contre les attaques par déni de service
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requêtes par minute
      },
    ]),
    
    // Gestion des événements
    EventEmitterModule.forRoot(),
    
    // Planification des tâches
    ScheduleModule.forRoot(),
    
    // Modules de configuration
    DatabaseModule,
    RedisModule,
    
    // Modules métier
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 