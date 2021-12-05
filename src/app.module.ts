import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';

const NODE_ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: NODE_ENV ? `.env.${NODE_ENV}` : '.env',
      load: [configuration],
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
