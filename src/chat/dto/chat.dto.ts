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

export class GetAllChatsInputDto extends PartialType(SearchPaginationDto) {}
export class GetAllChatsQueryOutDto extends SearchChatsOutputDto {}

export class GetAllChatsOutputDto {
  @ApiProperty()
  totalResults: number;
  @ApiProperty({ type: Array(GetAllChatsOutputDto) })
  results: GetAllChatsQueryOutDto[];
}
