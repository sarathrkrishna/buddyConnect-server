import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { GeneralRequestDto } from 'src/shared/dtos/auth/autherization.user.dto';

export class InsertClientInputDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  fullName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;
}

export class InsertClientOutputDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  displayPictureUrl: string;
  @ApiProperty()
  isDisabled: boolean;
  @ApiProperty()
  createAt: string;
}

export class UserOutputDto {
  id: string;
  username: string;
  password: string;
}

export class CheckUsernameAlreadyExistsInputDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class CheckUsernameAlreadyExistsOutputDto {
  @ApiProperty()
  status: string;
}

export class UploadFileRequestDto extends PartialType(GeneralRequestDto) {}

export class UploadFileOutputDto {
  displayPictureUrl: string;
}

export class UploadFileQueryDto {
  done: string;
  displayPictureUrl: string;
}
