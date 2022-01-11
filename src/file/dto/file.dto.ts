import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { GeneralRequestDto } from 'src/shared/dtos/auth/autherization.user.dto';

export class GetFileInputDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  imageURL: string;
}

export class UploadFileRequestDto extends PartialType(GeneralRequestDto) {}

export class UploadFileQueryDto {
  done: string;
  displayPictureUrl: string;
}

export class UploadFileOutputDto {
  displayPictureUrl: string;
}
