import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  findOneUserByUsernameQuery,
  insertNewClientQuery,
} from './queries/user.queries';
import {
  InsertClientInputDto,
  InsertClientOutputDto,
  UserOutputDto,
} from './dto/user.dto';
import { ConfigService } from '@nestjs/config';

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
    filePath?: string,
  ): Promise<InsertClientOutputDto> {
    const { username, password, fullName, description } = userDetails;

    const data = (
      await this.databaseService.rawQuery<InsertClientOutputDto>(
        insertNewClientQuery,
        [username, password, fullName, description, filePath || ''],
      )
    )[0];

    return {
      ...data,
      displayPictureUrl: data.displayPictureUrl
        ? `${this.configService.get(
            'mediaStorage.mediaStorageBaseUrl',
          )}/file?imageURL=${data.displayPictureUrl}`
        : undefined,
    };
  }
}
