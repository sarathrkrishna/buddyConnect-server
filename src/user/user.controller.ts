import {
  Body,
  Controller,
  Get,
  Request,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/auth/jwt-auth.guard';
import {
  CheckUsernameAlreadyExistsInputDto,
  CheckUsernameAlreadyExistsOutputDto,
  InsertClientInputDto,
  InsertClientOutputDto,
  UploadFileOutputDto,
  UploadFileRequestDto,
} from './dto/user.dto';
import { UserService } from './user.service';
@Controller('user')
@ApiTags('User-profile')
export class UserController {
  constructor(public readonly userService: UserService) {}

  @Post('signup')
  @ApiBody({ type: InsertClientInputDto })
  @ApiResponse({ type: InsertClientOutputDto })
  async userSignup(
    @Body() userDetails: InsertClientInputDto,
  ): Promise<InsertClientOutputDto> {
    return this.userService.userSignup(userDetails);
  }

  @Get('username/:username')
  @ApiParam(CheckUsernameAlreadyExistsInputDto)
  @ApiResponse({ type: CheckUsernameAlreadyExistsOutputDto })
  async checkUsernameAlreadyExists(
    @Param() param: CheckUsernameAlreadyExistsInputDto,
  ): Promise<CheckUsernameAlreadyExistsOutputDto> {
    return this.userService.checkUsernameAlreadyExists(param);
  }

  @Post('dp-upload')
  @UseInterceptors(FileInterceptor('displayPicture'))
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: UploadFileOutputDto })
  async dpUpload(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: UploadFileRequestDto,
  ): Promise<UploadFileOutputDto> {
    return this.userService.dpUpload(file, req);
  }
}
