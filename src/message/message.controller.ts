import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DatabaseService } from 'src/database/database.service';
import { JwtAuthGuard } from 'src/guards/auth/jwt-auth.guard';
import { GeneralRequestDto } from 'src/shared/dtos/auth/autherization.user.dto';
import {
  CreateMessageInputDto,
  CreateMessageQueryOutputDto,
  GetAllMessagesFromChatOutputDto,
  GetAllMessagesFromChatPaginationDto,
  SearchMessagesFromChatOutputDto,
  SearchMessagesFromChatPaginationDto,
} from './dto/message.dto';
import { MessageService } from './message.service';

@Controller('message')
@ApiTags('Message-APIs')
export class MessageController {
  constructor(private readonly messagingService: MessageService) {}

  @Post('create/:chat_id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'chat_id', required: true, type: String })
  @ApiQuery({ type: CreateMessageInputDto })
  @ApiResponse({ type: CreateMessageQueryOutputDto })
  async createMessage(
    @Body() body: CreateMessageInputDto,
    @Request() req: GeneralRequestDto,
    @Param('chat_id') chatId: string,
  ) {
    return this.messagingService.createMessage(body, req.user.id, chatId);
  }

  @Get('search/:chat_id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'chat_id', required: true, type: String })
  @ApiQuery({ type: SearchMessagesFromChatPaginationDto })
  @ApiResponse({ type: SearchMessagesFromChatOutputDto })
  async searchMessagesFromChat(
    @Query() pagination: SearchMessagesFromChatPaginationDto,
    @Param('chat_id') chatId: string,
    @Request() req: GeneralRequestDto,
  ) {
    return this.messagingService.searchMessagesFromChat(
      pagination,
      chatId,
      req.user.id,
    );
  }

  @Get(':chat_id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'chat_id', type: String, required: true })
  @ApiQuery({ type: GetAllMessagesFromChatPaginationDto })
  @ApiResponse({ type: GetAllMessagesFromChatOutputDto })
  async getAllMessagesFromChat(
    @Query() pagination: GetAllMessagesFromChatPaginationDto,
    @Param('chat_id') chatId: string,
    @Request() req: GeneralRequestDto,
  ) {
    return this.messagingService.getAllMessagesFromChat(
      pagination,
      chatId,
      req.user.id,
    );
  }
}
