import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { UserDataDto } from 'src/auth/dto/auth.dto';
import CONSTANTS from '../const/constants';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterOptions | Promise<MulterOptions> {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, './media-uploads');
        },
        filename: (req, file, cb) => {
          const { id = '' } = req.user as UserDataDto;
          cb(null, this.createFileName(file, id));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          !CONSTANTS.MULTER.SUPPORTED_IMAGE_TYPES.some(
            (val) => val === file.mimetype,
          )
        ) {
          cb(new UnsupportedMediaTypeException(), false);
          return;
        }
        cb(null, true);
      },
    };
  }
  createFileName(file, id): string {
    const fileExt = file.originalname.match(/\.\w+$/);
    return `${id}_${new Date().getTime()}_o${fileExt}`;
  }
}
