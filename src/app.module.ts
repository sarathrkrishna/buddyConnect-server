import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { FileModule } from './file/file.module';
import { UserModule } from './user/user.module';

const NODE_ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: NODE_ENV ? `.env.${NODE_ENV}` : '.env',
      load: [configuration],
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    FileModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
