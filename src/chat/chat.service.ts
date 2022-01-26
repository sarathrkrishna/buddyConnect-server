import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { GeneralRequestDto } from 'src/shared/dtos/auth/autherization.user.dto';
import {
  ChatCreateInputDto,
  ChatCreateOutputDto,
  DeleteChatOutputDto,
  GetAllChatsInputDto,
  GetAllChatsQueryOutDto,
  SearchChatsInputDto,
  SearchChatsOutputDto,
  SelectMemberChatMasterDataDto,
} from './dto/chat.dto';
import {
  createChatQuery,
  getAllChatsQuery,
  hardDeleteChatForBoth,
  searchChatQuery,
  selectMemberChatMasterData,
  softDeleteChatForUser,
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
      totalResults: results.length ? +results[0].totalResultsCount : 0,
      results: results.map((result) => ({
        ...result,
        totalResultsCount: undefined,
      })),
    };
  }

  async softDeleteChat(chatId: string, userId: string) {
    const data =
      await this.databaseService.rawQuery<SelectMemberChatMasterDataDto>(
        selectMemberChatMasterData,
        [userId, chatId],
      );

    if (!data.length) {
      throw new NotFoundException('The chat is invalid for this user');
    }
    const [{ clientId: memberId, isDeleted }] = data;

    if (!isDeleted) {
      const [data] = await this.databaseService.rawQuery<DeleteChatOutputDto>(
        softDeleteChatForUser,
        [userId, chatId],
      );

      return {
        memberId,
        chatId: data.chatId,
        status: 'soft_delete',
      };
    } else {
      const [data] = await this.databaseService.rawQuery<DeleteChatOutputDto>(
        hardDeleteChatForBoth,
        [chatId],
      );

      return {
        memberId,
        chatId: data.chatId,
        status: 'hard_delete',
      };
    }
  }
}
