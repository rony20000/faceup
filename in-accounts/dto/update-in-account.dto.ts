import { PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { CreateInAccountDto } from './create-in-account.dto';
export class UpdateInAccountDto extends PartialType(CreateInAccountDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  cookies?: Record<string, string>[];

  @IsOptional()
  @IsBoolean()
  isConnected?: boolean;

  @IsOptional()
  @IsObject()
  setting?: any;

  @IsOptional()
  @IsObject()
  limits?: any;
}
