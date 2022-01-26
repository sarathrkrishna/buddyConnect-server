import { ApiProperty, PartialType } from '@nestjs/swagger';
import { SearchPaginationDto } from '../../shared/dtos/general-dto';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class ChatCreateInputDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  memberId: string;
}

export class ChatCreateOutputDto {
  @ApiProperty()
  chatId: string;
  @ApiProperty()
  clientId: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  displayPictureUrl: string;
}

export class SearchChatsInputDto extends SearchPaginationDto {}

export class SearchChatsOutputDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  clientId: string;
  @ApiProperty()
  chatId: string;
  @ApiProperty()
  creatorId: string;
  @ApiProperty()
  displayPictureUrl: string;
  @ApiProperty()
  lastUpdated: string;
  @ApiProperty()
  @Type(() => Number)
  totalResultsCount: number;
}

export class SearchChatsApiResultsDto {
  @ApiProperty()
  searchString: string;

  @ApiProperty()
  totalResults: number;

  @ApiProperty({ type: Array(SearchChatsOutputDto) })
  results: SearchChatsOutputDto[];
}

export class GetAllChatsInputDto extends SearchPaginationDto {}
export class GetAllChatsQueryOutDto extends SearchChatsOutputDto {}

export class GetAllChatsOutputDto {
  @ApiProperty()
  totalResults: number;
  @ApiProperty({ type: Array(GetAllChatsOutputDto) })
  results: GetAllChatsQueryOutDto[];
}

export class SelectMemberChatMasterDataDto {
  clientId: string;
  chatId: string;
  isDeleted: boolean;
}

export class DeleteChatOutputDto {
  chatId: string;
}

export class MemberChatExistsDto {
  memberId: string;
  chatMasterId: string;
  chatId: string;
  isDeleted: boolean;
}

export class ChatDeleteOutputDto {
  @ApiProperty()
  memberId: string;
  @ApiProperty()
  chatId: string;
  @ApiProperty()
  status: string;
}
