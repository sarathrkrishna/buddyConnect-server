import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CheckUsernameAlreadyExistsInputDto,
  CheckUsernameAlreadyExistsOutputDto,
  InsertClientInputDto,
  InsertClientOutputDto,
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
}
