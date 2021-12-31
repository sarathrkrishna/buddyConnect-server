import { Type } from 'class-transformer';
import { IsEmail, IsNumber } from 'class-validator';

export class TestQueryDto {
  @IsEmail()
  email: string;

  @Type(() => Number)
  @IsNumber()
  id: number;
}
