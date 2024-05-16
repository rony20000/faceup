import { CryptoService } from '@app/crypto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { inAccountLimits } from './in-account-limits.schema';

export type InAccountDocument = HydratedDocument<InAccount>;
export const LinkedInSetting = {
  replyTo: String,
};

@Schema()
export class InAccount {
  @Prop()
  fullName: string;

  @Prop()
  email: string;

  @Prop()
  photoUrl: string;

  @Prop({
    unique: true,
    required: [true, 'accessKey must be unique'],
  })
  accessKey: string;

  // @Prop({ required: [true, 'password must be provided'] })
  // password: string;

  @Prop({ required: [true, 'password must be provided'] })
  encryptedPassword: string;

  @Prop({ type: [mongoose.Schema.Types.Mixed] })
  cookies: object[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'inAccountLimits',
    required: [true, 'limits must be provided'],
  })
  limits: inAccountLimits;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  teamId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: true })
  isConnected: boolean;

  @Prop({
    type: LinkedInSetting,
    default: {
      replyTo: '',
    },
  })
  setting: typeof LinkedInSetting;

  getPassword: () => Promise<string>;
}

export const InAccountSchema = SchemaFactory.createForClass(InAccount);

InAccountSchema.method('getPassword', function () {
  return CryptoService.decrypt(this.encryptedPassword);
});
