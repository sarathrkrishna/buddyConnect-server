import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  findOneUserByUsernameQuery,
  getUserQuery,
  insertNewClientQuery,
  searchUserQuery,
  uploadFileQuery,
  usernameAlreadyExistsQuery,
} from './queries/user.queries';
import {
  CheckUsernameAlreadyExistsInputDto,
  CheckUsernameAlreadyExistsOutputDto,
  GetUserOutputDto,
  GetUserQueryDto,
  InsertClientInputDto,
  InsertClientOutputDto,
  SearchUsersQueryOutputDto,
  UpdateUserInputDto,
  UpdateUserOutputDto,
  UpdateUserReqDto,
  UploadFileOutputDto,
  UploadFileQueryDto,
  UploadFileRequestDto,
  UserOutputDto,
} from './dto/user.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import {
  GET_USER_SEARCH_BY_KEYS,
  SEARCH_PAGINATION_CONSTS,
} from 'src/shared/const/server-constants';
import * as pgFormat from 'pg-format';
import { SearchPaginationDto } from 'src/shared/dtos/general-dto';
import {
  isUUID,
  prepareUpdateQueryKeyValuesString,
} from 'src/shared/utils/utils';
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

  async getUser(query: GetUserQueryDto, uniqueKey: string) {
    const { searchBy = 'id' } = query;

    let sqlQuery: string;

    switch (searchBy) {
      case GET_USER_SEARCH_BY_KEYS.ID:
        // check whether uniqueKey is uuid or not;
        if (!isUUID(uniqueKey)) {
          throw new BadRequestException('id is not a UUID.');
        }
        sqlQuery = pgFormat(
          getUserQuery,
          GET_USER_SEARCH_BY_KEYS.ID,
          uniqueKey,
        );
        break;
      case GET_USER_SEARCH_BY_KEYS.USERNAME:
        sqlQuery = pgFormat(
          getUserQuery,
          GET_USER_SEARCH_BY_KEYS.USERNAME,
          uniqueKey,
        );
        break;
    }

    const [userData] = await this.databaseService.rawQuery<GetUserOutputDto>(
      sqlQuery,
    );

    if (!userData) {
      throw new NotFoundException('User not found');
    }

    return userData;
  }

  async searchUsers(query: SearchPaginationDto) {
    const {
      limit = SEARCH_PAGINATION_CONSTS.LIMIT,
      offset = SEARCH_PAGINATION_CONSTS.OFFSET,
      searchString = '',
    } = query;

    const searchKey = searchString ? `${searchString}%` : '';

    const results =
      await this.databaseService.rawQuery<SearchUsersQueryOutputDto>(
        searchUserQuery,
        [searchKey, limit, offset],
      );

    return {
      searchString,
      totalResults: results.length ? results[0].totalResults : 0,
      results: results.map((result) => ({
        ...result,
        totalResults: undefined,
      })),
    };
  }

  async updateUser(req: UpdateUserReqDto, body: UpdateUserInputDto) {
    const id = req.user.id;

    if (body.password) {
      const hashedPassword = await bcrypt.hash(
        body.password,
        +this.configService.get('auth.hash_salt'),
      );
      body.password = hashedPassword;
    }

    const { query: keyValuesString, valueArr: values } =
      prepareUpdateQueryKeyValuesString(body);

    let sqlQuery: string;

    if (body.username) {
      sqlQuery = pgFormat(
        `
      WITH
	      username_exists AS (
	      	SELECT 1 AS exists FROM client_master WHERE username=%L
	      )
      UPDATE client_master SET ${keyValuesString} WHERE id = %L AND NOT EXISTS (SELECT FROM username_exists) RETURNING id, username, full_name, description, display_picture_url, create_at;`,
        body.username,
        ...values,
        id,
      );
    } else {
      sqlQuery = pgFormat(
        `UPDATE client_master SET ${keyValuesString} WHERE id = %L RETURNING id, username, full_name, description, display_picture_url, create_at;`,
        ...values,
        id,
      );
    }

    const [updatedRow] =
      await this.databaseService.rawQuery<UpdateUserOutputDto>(sqlQuery);

    if (!updatedRow) {
      throw new NotFoundException('Cannot update');
    }

    return updatedRow;
  }
}
