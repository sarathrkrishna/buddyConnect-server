import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InsertClientInputDto, InsertClientOutputDto } from './dto/user.dto';
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
}
