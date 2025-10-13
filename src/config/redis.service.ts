import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redisClient: Redis;

  constructor(private configService: ConfigService) {
    this.redisClient = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD'),
      lazyConnect: true,
    });

    this.redisClient.on('connect', () => {
      console.log(' Connexion Redis établie');
    });

    this.redisClient.on('error', (error) => {
      console.error(' Erreur Redis:', error);
    });
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redisClient.setex(key, ttl, value);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redisClient.exists(key);
    return result === 1;
  }

  async expire(key: string, ttl: number): Promise<void> {
    await this.redisClient.expire(key, ttl);
  }

  async ttl(key: string): Promise<number> {
    return await this.redisClient.ttl(key);
  }

  async flushdb(): Promise<void> {
    await this.redisClient.flushdb();
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
    console.log('🔌 Connexion Redis fermée');
  }
} 