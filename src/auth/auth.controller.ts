import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async userLogin(@Request() req) {
    return this.authService.userLogin(req.user);
  }

  // TO BE REMOVED
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async userProfileTest(@Request() req) {
    return req.user;
  }
}
