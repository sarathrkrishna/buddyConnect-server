import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginOutput, UserDataDto, UserDataPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserDataDto | null> {
    const user = await this.userService.findOneUserByUsername(username);
    if (!user) {
      // even if user not found, best to throw unauthorized exception
      throw new UnauthorizedException();
    }
    const { password: hashedPassword, ...userData } = user;
    const result = await bcrypt.compare(password, hashedPassword);
    if (result) {
      return userData; // password excluded data
    } else {
      return null;
    }
  }

  async userLogin(user: UserDataDto): Promise<LoginOutput> {
    const payload: UserDataPayloadDto = {
      username: user.username,
      sub: user.id,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
