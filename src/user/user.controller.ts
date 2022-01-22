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
  Query,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/auth/jwt-auth.guard';
import { SearchPaginationDto } from 'src/shared/dtos/general-dto';
import {
  CheckUsernameAlreadyExistsInputDto,
  CheckUsernameAlreadyExistsOutputDto,
  GetUserOutputDto,
  GetUserQueryDto,
  InsertClientInputDto,
  InsertClientOutputDto,
  SearchUsersOutputDto,
  UpdateUserInputDto,
  UpdateUserOutputDto,
  UpdateUserReqDto,
  UploadFileOutputDto,
  UploadFileRequestDto,
} from './dto/user.dto';
import { UserService } from './user.service';
@Controller('user')
@ApiTags('User-profile')
export class UserController {
  constructor(public readonly userService: UserService) {}

  @Get('username/:username')
  @ApiParam(CheckUsernameAlreadyExistsInputDto)
  @ApiResponse({ type: CheckUsernameAlreadyExistsOutputDto })
  async checkUsernameAlreadyExists(
    @Param() param: CheckUsernameAlreadyExistsInputDto,
  ): Promise<CheckUsernameAlreadyExistsOutputDto> {
    return this.userService.checkUsernameAlreadyExists(param);
  }

  @Patch('update-user')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpdateUserInputDto })
  @ApiResponse({ type: UpdateUserOutputDto })
  async updateUser(
    @Body() body: UpdateUserInputDto,
    @Request() req: UpdateUserReqDto,
  ) {
    return this.userService.updateUser(req, body);
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

  @Post('signup')
  @ApiBody({ type: InsertClientInputDto })
  @ApiResponse({ type: InsertClientOutputDto })
  async userSignup(
    @Body() userDetails: InsertClientInputDto,
  ): Promise<InsertClientOutputDto> {
    return this.userService.userSignup(userDetails);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ type: SearchPaginationDto })
  @ApiResponse({ type: SearchUsersOutputDto })
  async searchUsers(
    @Query() query: SearchPaginationDto,
    @Request() req: UpdateUserReqDto,
  ) {
    return this.userService.searchUsers(query, req.user.id);
  }

  @Get(':uniqueKey')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'uniqueKey' })
  @ApiQuery({ type: GetUserQueryDto })
  @ApiResponse({ type: GetUserOutputDto })
  async getUser(
    @Query() query: GetUserQueryDto,
    @Param('uniqueKey') uniqueKey: string,
  ) {
    return this.userService.getUser(query, uniqueKey);
  }
}
