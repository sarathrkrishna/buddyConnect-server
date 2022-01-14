import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchPaginationDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  offset: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  searchString: string;
}
