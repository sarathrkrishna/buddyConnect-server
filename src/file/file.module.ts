import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseModule } from 'src/database/database.module';
import { MulterConfigService } from 'src/shared/multer/multer.config.service';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    DatabaseModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
