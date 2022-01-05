import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InsertClientInputDto, InsertClientOutputDto } from './dto/user.dto';
import { UserService } from './user.service';
@Controller('user')
@ApiTags('User-profile')
export class UserController {
  constructor(public readonly userService: UserService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('displayPictureURL'))
  @ApiBody({ type: InsertClientInputDto })
  @ApiResponse({ type: InsertClientOutputDto })
  async userSignup(
    @UploadedFile() file: Express.Multer.File,
    @Body() userDetails: InsertClientInputDto,
  ): Promise<InsertClientOutputDto> {
    return this.userService.userSignup(userDetails, file?.path);
  }
}
