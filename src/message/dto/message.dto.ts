import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

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
