import { Type } from 'class-transformer';
import { IsNotEmptyObject, IsString, ValidateNested } from 'class-validator';
import { CreateInAccounLimitstDto } from './create-in-account-limits.dto';

export class CreateInAccountDto {
  @IsString()
  accessKey: string;

  @IsString()
  password: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateInAccounLimitstDto)
  limits: CreateInAccounLimitstDto;
}
