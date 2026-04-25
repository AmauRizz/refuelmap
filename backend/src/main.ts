import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from "@nestjs/config";
import { ValidationPipe, Logger } from "@nestjs/common";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug'],
  });
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');
  const port = configService.get<number>('PORT', 3000);

  app.useLogger(
      configService.get<string>('NODE_ENV', 'production') === 'production'
          ? ['error', 'warn', 'log']
          : ['error', 'warn', 'log', 'debug'],
  );

  app.use(helmet());

  app.enableCors({
      origin: configService.get<string>('FRONTEND_URL', 'http://localhost:3000'),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
  });

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

  await app.listen(port);
}
bootstrap();