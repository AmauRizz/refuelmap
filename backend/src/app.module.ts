import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        CacheModule.registerAsync({
            isGlobal: true,
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                ttl: config.get<number>('CACHE_TTL', 300_000),
            }),
            inject: [ConfigService],
        }),
        PrismaModule,
        HttpModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                timeout: config.get('HTTP_TIMEOUT', 5000),
                maxRedirects: 3,
            }),
            inject: [ConfigService],
        }),
        ScheduleModule.forRoot(),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
    ],
})
export class AppModule {}