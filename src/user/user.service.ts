import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { findOneUserByUsernameQuery } from './queries/user.queries';
import { UserOutputDto } from './dto/user.dto';
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
}
