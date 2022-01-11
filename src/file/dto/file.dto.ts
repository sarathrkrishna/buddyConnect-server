import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetFileInputDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  imageURL: string;
}
