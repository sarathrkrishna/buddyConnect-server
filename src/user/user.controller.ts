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
  Delete,
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
  DeleteDisableUserInputDto,
  GetUserOutputDto,
  GetUserQueryDto,
  InsertClientInputDto,
  InsertClientOutputDto,
  SearchUsersOutputDto,
  UpdateUserInputDto,
  UpdateUserOutputDto,
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

  @Patch('update-user/:id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateUserInputDto })
  @ApiResponse({ type: UpdateUserOutputDto })
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserInputDto) {
    return this.userService.updateUser(id, body);
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
  async searchUsers(@Query() query: SearchPaginationDto) {
    return this.userService.searchUsers(query);
  }

  @Delete('delete')
  async deleteOrDisableUser(@Query() query: DeleteDisableUserInputDto) {
    return this.userService.deleteOrDisableUser(query);
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
