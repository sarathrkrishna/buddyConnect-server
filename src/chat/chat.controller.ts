import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/auth/jwt-auth.guard';
import { GeneralRequestDto } from 'src/shared/dtos/auth/autherization.user.dto';
import { ChatService } from './chat.service';
import {
  ChatCreateInputDto,
  ChatCreateOutputDto,
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
}
