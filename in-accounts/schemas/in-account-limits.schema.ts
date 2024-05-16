import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type inAccountLimitsDocument = HydratedDocument<inAccountLimits>;

@Schema()
export class inAccountLimits {
  @Prop({
    required: [true, 'views must be provided'],
    default: 50,
    min: [1, 'views limits must be between 1 and 120'],
    max: [120, 'views limits must be between 1 and 120'],
  })
  views: number;

  @Prop({
    required: [true, 'connections must be provided'],
    default: 30,
    min: [1, 'connections limits must be between 1 and 60'],
    max: [60, 'connections limits must be between 1 and 60'],
  })
  connections: number;

  @Prop({
    required: [true, 'withdraws must be provided'],
    default: 30,
    min: [1, 'withdraws limits must be between 1 and 150'],
    max: [150, 'withdraws limits must be between 1 and 150'],
  })
  withdraws: number;

  @Prop({
    required: [true, 'messages must be provided'],
    default: 50,
    min: [1, 'messages limits must be between 1 and 60'],
    max: [60, 'messages limits must be between 1 and 60'],
  })
  messages: number;

  @Prop({
    required: [true, 'likes must be provided'],
    default: 50,
    min: [1, 'likes limits must be between 1 and 100'],
    max: [100, 'likes limits must be between 1 and 100'],
  })
  likes: number;

  @Prop({
    required: [true, 'endorses must be provided'],
    default: 50,
    min: [1, 'endorses limits must be between 1 and 100'],
    max: [100, 'endorses limits must be between 1 and 100'],
  })
  endorses: number;
}

export const inAccountLimitsSchema = SchemaFactory.createForClass(inAccountLimits);
