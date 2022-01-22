import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { GeneralRequestDto } from 'src/shared/dtos/auth/autherization.user.dto';
import {
  ChatCreateInputDto,
  ChatCreateOutputDto,
  GetAllChatsInputDto,
  GetAllChatsQueryOutDto,
  SearchChatsInputDto,
  SearchChatsOutputDto,
} from './dto/chat.dto';
import {
  createChatQuery,
  getAllChatsQuery,
  searchChatQuery,
} from './queries/chat.queries';

@Injectable()
export class ChatService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createChat(body: ChatCreateInputDto, creatorId: string) {
    const { memberId } = body;

    const data = await this.databaseService.rawQuery<ChatCreateOutputDto>(
      createChatQuery,
      [creatorId, memberId],
    );

    if (!data.length) {
      throw new ConflictException('Unable to create chat');
    }

    return data[0];
  }

  async searchChats(query: SearchChatsInputDto, req: GeneralRequestDto) {
    const { limit, offset, searchString } = query;

    const searchKey = `${searchString || ''}%`;

    const results = await this.databaseService.rawQuery<SearchChatsOutputDto>(
      searchChatQuery,
      [searchKey, req.user.id, limit, offset],
    );

    return {
      searchString,
      totalResults: results.length ? +results[0].totalResultsCount : 0,
      results: results.map((result) => ({
        ...result,
        totalResultsCount: undefined,
      })),
    };
  }

  async getAllChats(query: GetAllChatsInputDto, userId: string) {
    const { limit, offset } = query;

    const results = await this.databaseService.rawQuery<GetAllChatsQueryOutDto>(
      getAllChatsQuery,
      [userId, limit, offset],
    );

    return {
      totalResults: results.length ? results[0].totalResultsCount : 0,
      results: results.map((result) => ({
        ...result,
        totalResultsCount: undefined,
      })),
    };
  }
}
