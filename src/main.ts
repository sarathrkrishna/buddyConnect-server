import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const logger = new Logger('Main');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: true,
      whitelist: true, // accept only the parameters that are specified in DTO
      transform: true, // transform params if possible
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get('port');
  const environment = configService.get('environment');

  app.enableShutdownHooks();

  // swagger
  const options = new DocumentBuilder()
    .setTitle('BuddyConnect Server')
    .setDescription("BuddyConnect's API server cluster")
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  logger.debug(`Server is up at port ${port} in ${environment} environment`);
}
bootstrap();
