import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PAGINATION_DEFAULTS } from '../const/server-constants';

export class SearchPaginationDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit: number = PAGINATION_DEFAULTS.DEF_LIMIT;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  offset: number = PAGINATION_DEFAULTS.DEF_OFFSET;

  @ApiProperty()
  @IsString()
  @IsOptional()
  searchString: string;
}
