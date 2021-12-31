import { ApiProperty } from '@nestjs/swagger';

export class UserDataDto {
  id: string;
  username: string;
}

export class UserDataPayloadDto {
  username: string;
  sub: string;
}

export class LoginInputDto {
  user: UserDataDto;
}

export class LoginInput {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

export class LoginOutput {
  @ApiProperty()
  accessToken: string;
}
