import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Main');

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: true,
      whitelist: true, // accept parameters that are specified in DTO
      transform: true, // transform params if possible
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get('port');
  const environment = configService.get('environment');

  app.enableShutdownHooks();

  await app.listen(port);

  logger.debug(`Server is up at port ${port} in ${environment} environment`);
}
bootstrap();
