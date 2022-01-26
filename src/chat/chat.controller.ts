import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/auth/jwt-auth.guard';
import { GeneralRequestDto } from 'src/shared/dtos/auth/autherization.user.dto';
import { ChatService } from './chat.service';
import {
  ChatCreateInputDto,
  ChatCreateOutputDto,
  ChatDeleteOutputDto,
  GetAllChatsInputDto,
  GetAllChatsOutputDto,
  SearchChatsInputDto,
  SearchChatsOutputDto,
} from './dto/chat.dto';

@Controller('chat')
@ApiTags('chat-apis')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('search')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ type: SearchChatsInputDto })
  @ApiResponse({ type: SearchChatsOutputDto })
  async searchChats(
    @Query() query: SearchChatsInputDto,
    @Request() req: GeneralRequestDto,
  ) {
    return this.chatService.searchChats(query, req);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ type: GetAllChatsInputDto })
  @ApiResponse({ type: GetAllChatsOutputDto })
  async getAllChats(
    @Query() query: GetAllChatsInputDto,
    @Request() req: GeneralRequestDto,
  ) {
    return this.chatService.getAllChats(query, req.user.id);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: ChatCreateInputDto })
  @ApiResponse({ type: ChatCreateOutputDto })
  async createChat(
    @Request() req: GeneralRequestDto,
    @Body() body: ChatCreateInputDto,
  ) {
    return this.chatService.createChat(body, req.user.id);
  }

  @Delete('delete/:chat_id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'chat_id', type: String })
  @ApiResponse({ type: ChatDeleteOutputDto })
  async softDeleteChat(
    @Param('chat_id') chatId: string,
    @Request() req: GeneralRequestDto,
  ) {
    return this.chatService.softDeleteChat(chatId, req.user.id);
  }
}
