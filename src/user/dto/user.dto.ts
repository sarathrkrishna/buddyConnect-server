import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class InsertClientInputDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  fullName: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  isDisabled: string;
}

export class InsertClientOutputDto {
  id: number;
  username: string;
  fullName: string;
  description: string;
  isDisabled: boolean;
  createdAt: string;
}

export class UserOutputDto {
  id: string;
  username: string;
  password: string;
}
