import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { isUUID } from 'src/shared/utils/utils';
import {
  CreateMessageInputDto,
  CreateMessageQueryOutputDto,
  GetAllMessagesFromChatPaginationDto,
  GetAllMessagesFromChatQueryDto,
  SearchMessagesFromChatOutputDto,
  SearchMessagesFromChatPaginationDto,
  SearchMessagesFromChatQueryDto,
} from './dto/message.dto';
import {
  createMessageQuery,
  getAllMessagesFromChatQuery,
  searchMessagesFromChatQuery,
} from './queries/message.queries';

@Injectable()
export class MessageService {
  constructor(private readonly databaseService: DatabaseService) {}
  async createMessage(
    body: CreateMessageInputDto,
    userId: string,
    chatId: string,
  ) {
    const { messageBody } = body;

    if (!isUUID(chatId)) {
      throw new BadRequestException('chat_id is not a UUID.');
    }

    const messageRows =
      await this.databaseService.rawQuery<CreateMessageQueryOutputDto>(
        createMessageQuery,
        [userId, chatId, messageBody],
      );

    if (!messageRows.length) {
      throw new NotFoundException('The chat is not found for the user');
    }

    return messageRows[0];
  }

  async getAllMessagesFromChat(
    pagination: GetAllMessagesFromChatPaginationDto,
    chatId: string,
    userId: string,
  ) {
    const { limit, offset } = pagination;

    if (!isUUID(chatId)) {
      throw new BadRequestException('chat_id is not a UUID.');
    }

    const messageRows =
      await this.databaseService.rawQuery<GetAllMessagesFromChatQueryDto>(
        getAllMessagesFromChatQuery,
        [userId, chatId, limit, offset],
      );

    return {
      totalCount: messageRows.length ? +messageRows[0].totalCount : 0,
      results: messageRows.map((row) => ({
        ...row,
        totalCount: undefined,
      })),
    };
  }

  async searchMessagesFromChat(
    pagination: SearchMessagesFromChatPaginationDto,
    chatId: string,
    userId: string,
  ) {
    const { limit, offset, searchString } = pagination;

    if (!isUUID(chatId)) {
      throw new BadRequestException('chat_id is not a UUID.');
    }

    const searchKey = `%${searchString || ''}%`;

    const messageRows =
      await this.databaseService.rawQuery<SearchMessagesFromChatQueryDto>(
        searchMessagesFromChatQuery,
        [userId, chatId, searchKey, limit, offset],
      );

    const response: SearchMessagesFromChatOutputDto = {
      searchString: searchString,
      totalCount: messageRows.length ? +messageRows[0].totalCount : 0,
      results: messageRows.map((row) => ({
        ...row,
        totalCount: undefined,
      })),
    };

    return response;
  }
}
