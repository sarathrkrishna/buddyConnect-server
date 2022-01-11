import { Injectable, NotAcceptableException } from '@nestjs/common';
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
}
