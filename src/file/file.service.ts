import { Injectable, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream } from 'fs';
import { join } from 'path';
import { DatabaseService } from 'src/database/database.service';
import { GetFileInputDto } from './dto/file.dto';

@Injectable()
export class FileService {
  constructor(
    private readonly configService: ConfigService,
    public readonly dataService: DatabaseService,
  ) {}
  getFile(urlParam: GetFileInputDto, res) {
    //TODO service should be updated to work with cloud storage
    const file = createReadStream(join(process.cwd(), urlParam.imageURL));
    const fileExtension = urlParam.imageURL.match(/\.[a-z0-9]+$/i)[0].slice(1);
    res.set({
      'Content-Type': `image/${
        fileExtension !== 'jpg' ? fileExtension : 'jpeg'
      }`,
    });
    return new StreamableFile(file);
  }
}
