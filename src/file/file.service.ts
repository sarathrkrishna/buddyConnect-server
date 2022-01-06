import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { GetFileInputDto } from './dto/file.dto';

@Injectable()
export class FileService {
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
