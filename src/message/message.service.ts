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
} from './dto/message.dto';
import { createMessageQuery } from './queries/message.queries';

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
}
