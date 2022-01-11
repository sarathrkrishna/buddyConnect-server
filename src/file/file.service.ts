import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  StreamableFile,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream } from 'fs';
import { join } from 'path';
import { DatabaseService } from 'src/database/database.service';
import {
  GetFileInputDto,
  UploadFileOutputDto,
  UploadFileQueryDto,
  UploadFileRequestDto,
} from './dto/file.dto';
import {
  getExistingDisplayPictureUrl,
  uploadFileQuery,
} from './queries/upload-file.query';

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

  async uploadFile(
    file: Express.Multer.File,
    req: UploadFileRequestDto,
  ): Promise<UploadFileOutputDto> {
    if (!file) {
      throw new NotAcceptableException('File is empty.');
    }

    const filePath = file.path;
    const { id: userId } = req.user;

    const fullFilePath = filePath
      ? `${this.configService.get(
          'mediaStorage.mediaStorageBaseUrl',
        )}/file?imageURL=${filePath}`
      : '';

    const [{ done, displayPictureUrl }] =
      await this.dataService.rawQuery<UploadFileQueryDto>(uploadFileQuery, [
        fullFilePath,
        userId,
      ]);

    if (!done) {
      throw new InternalServerErrorException('Could not update.');
    }

    return {
      displayPictureUrl,
    };
  }
}
