import { Module, forwardRef } from '@nestjs/common';
import { InAccountsService } from './in-accounts.service';
import { inAccountsController } from './in-accounts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { InAccount, InAccountSchema } from './schemas/in-account.schema';
import {
  inAccountLimits,
  inAccountLimitsSchema,
} from './schemas/in-account-limits.schema';
import { InCampaignsModule } from '../in-campaigns/in-campaigns.module';
import { SchedulerModule } from '../scheduler/scheduler.module';
import { ProxiesModule } from '../proxies/proxies.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InAccount.name, schema: InAccountSchema },
      { name: inAccountLimits.name, schema: inAccountLimitsSchema },
    ]),
    forwardRef(() => InCampaignsModule),
    ProxiesModule,
    forwardRef(() => SchedulerModule),
  ],
  controllers: [inAccountsController],
  providers: [InAccountsService],
  exports: [InAccountsService],
})
export class InAccountsModule {}
