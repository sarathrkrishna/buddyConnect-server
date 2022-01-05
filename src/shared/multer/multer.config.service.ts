import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
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
          const fileExt = file.originalname.split('.').slice(-1);
          cb(null, `${Math.random().toString().slice(2, 20)}_org.${fileExt}`);
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
}
