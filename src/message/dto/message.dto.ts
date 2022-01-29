import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { SearchPaginationDto } from 'src/shared/dtos/general-dto';

export class CreateMessageInputDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  messageBody: string;
}

export class CreateMessageQueryOutputDto {
  @ApiProperty()
  messageId: string;
  @ApiProperty()
  chatId: string;
  @ApiProperty()
  messageBody: string;
  @ApiProperty()
  senderId: string;
  @ApiProperty()
  createAt: string;
}

export class GetAllMessagesFromChatPaginationDto extends SearchPaginationDto {}

export class GetAllMessageFromChatResult {
  messageId: string;
  messageBody: string;
  senderId: string;
  createAt: string;
  chatId: string;
}
export class GetAllMessagesFromChatQueryDto extends GetAllMessageFromChatResult {
  totalCount: string;
}

export class GetAllMessagesFromChatOutputDto {
  @ApiProperty()
  totalCount: number;
  @ApiProperty({ type: Array(GetAllMessageFromChatResult) })
  results: GetAllMessageFromChatResult[];
}

export class SearchMessagesFromChatPaginationDto extends SearchPaginationDto {}

export class SearchMessagesFromChatQueryDto extends GetAllMessageFromChatResult {
  totalCount: string;
}

export class SearchMessagesFromChatOutputDto {
  @ApiProperty()
  searchString: string;
  @ApiProperty()
  totalCount: number;
  @ApiProperty({ type: Array(GetAllMessageFromChatResult) })
  results: GetAllMessageFromChatResult[];
}
