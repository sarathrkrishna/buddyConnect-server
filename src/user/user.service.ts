import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  findOneUserByUsernameQuery,
  insertNewClientQuery,
  uploadFileQuery,
  usernameAlreadyExistsQuery,
} from './queries/user.queries';
import {
  CheckUsernameAlreadyExistsInputDto,
  CheckUsernameAlreadyExistsOutputDto,
  InsertClientInputDto,
  InsertClientOutputDto,
  UploadFileOutputDto,
  UploadFileQueryDto,
  UploadFileRequestDto,
  UserOutputDto,
} from './dto/user.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
  ) {}

  async findOneUserByUsername(username: string) {
    const [user] = await this.databaseService.rawQuery<UserOutputDto>(
      findOneUserByUsernameQuery,
      [username],
    );

    return user;
  }

  async userSignup(
    userDetails: InsertClientInputDto,
  ): Promise<InsertClientOutputDto> {
    const { username, password, fullName, description } = userDetails;

    const hashedPassword = await bcrypt.hash(
      password,
      +this.configService.get('auth.hash_salt'),
    );

    const data = (
      await this.databaseService.rawQuery<InsertClientOutputDto>(
        insertNewClientQuery,
        [username, hashedPassword, fullName, description],
      )
    )[0];

    if (!data) {
      throw new NotAcceptableException('Username already exists.');
    }

    return data;
  }

  async checkUsernameAlreadyExists({
    username,
  }: CheckUsernameAlreadyExistsInputDto): Promise<CheckUsernameAlreadyExistsOutputDto> {
    const [{ exists = undefined } = {}] = await this.databaseService.rawQuery<{
      exists: string;
    }>(usernameAlreadyExistsQuery, [username]);

    if (exists) {
      throw new NotAcceptableException('Username exists');
    }

    return {
      status: 'good',
    };
  }

  async dpUpload(
    file: Express.Multer.File,
    req: UploadFileRequestDto,
  ): Promise<UploadFileOutputDto> {
    if (!file) {
      throw new NotAcceptableException('File Path is empty.');
    }

    const filePath = file.path;
    const { id: userId } = req.user;

    const fullFilePath = filePath
      ? `${this.configService.get(
          'mediaStorage.mediaStorageBaseUrl',
        )}/file?imageURL=${filePath}`
      : '';

    const [{ done, displayPictureUrl }] =
      await this.databaseService.rawQuery<UploadFileQueryDto>(uploadFileQuery, [
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
