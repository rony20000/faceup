import { inAccountsController } from './in-accounts.controller';
import { InAccountsService } from './in-accounts.service';
import { ProxiesService } from '../proxies/proxies.service';
import { SchedulerService } from '../scheduler/scheduler.service';
import { Request } from 'express';
import { NotFoundException } from '@nestjs/common';

describe('inAccountsController', () => {
  let controller: inAccountsController;
  let inAccountsService: InAccountsService;
  let proxiesService: ProxiesService;
  let schedulerService: SchedulerService;

  beforeEach(() => {
    controller = new inAccountsController(
      inAccountsService,
      proxiesService,
      schedulerService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });




});
