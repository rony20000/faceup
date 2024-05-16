import { IsPositive, Max, Min } from 'class-validator';

export class CreateInAccounLimitstDto {
  @IsPositive()
  @Min(1)
  @Max(60)
  views: number;

  @IsPositive()
  @Min(1)
  @Max(60)
  connections: number;

  @IsPositive()
  @Min(1)
  @Max(150)
  withdraws: number;

  @IsPositive()
  @Min(1)
  @Max(60)
  messages: number;

  @IsPositive()
  @Min(1)
  @Max(100)
  likes: number;

  @IsPositive()
  @Min(1)
  @Max(100)
  endorses: number;
}
