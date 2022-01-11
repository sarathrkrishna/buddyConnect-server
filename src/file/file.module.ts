import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [DatabaseModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
