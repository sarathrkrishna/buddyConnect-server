import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guards/auth/local-auth.guard';
import { AuthService } from './auth.service';
import { LoginInput, LoginInputDto, LoginOutput } from './dto/auth.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginInput })
  @ApiResponse({ type: LoginOutput })
  async userLogin(@Request() req: LoginInputDto): Promise<LoginOutput> {
    return this.authService.userLogin(req.user);
  }

  // TO BE REMOVED
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async userProfileTest(@Request() req) {
    return req.user;
  }
}
