import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsIn,
  IsISBN,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  DFLAG_LIST,
  GET_USER_SEARCH_BY_LIST,
} from 'src/shared/const/server-constants';
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

export class MasterClientDataDto {
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
  isDisabled: string;
  @ApiProperty()
  createAt: string;
}
export class InsertClientOutputDto extends PartialType(MasterClientDataDto) {}

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

export class GetUserQueryDto {
  @ApiProperty()
  @IsString()
  @IsIn(GET_USER_SEARCH_BY_LIST)
  searchBy: string;
}

export class GetUserOutputDto extends PartialType(MasterClientDataDto) {}

export class SearchUsersQueryOutputDto extends PartialType(
  MasterClientDataDto,
) {
  @ApiProperty()
  totalResults: number;
}

export class SearchUsersOutputDto {
  @ApiProperty()
  searchString: string;

  @ApiProperty()
  totalResults: number;

  @ApiProperty({ type: Array(MasterClientDataDto) })
  results: MasterClientDataDto[];
}

export class UpdateUserInputDto extends PartialType(InsertClientInputDto) {}

export class UpdateUserOutputDto extends PartialType(MasterClientDataDto) {}

export class DeleteDisableUserInputDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(DFLAG_LIST)
  dFlag: string;
}
