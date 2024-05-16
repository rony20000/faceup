import linkedinCore from '@app/linkedin-core';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import mongoose from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProxiesService } from '../proxies/proxies.service';
import { ProxyDocument } from '../proxies/schemas/proxy.schema';
import { SchedulerService } from '../scheduler/scheduler.service';
import { CreateInAccountDto } from './dto/create-in-account.dto';
import { UpdateInAccountDto } from './dto/update-in-account.dto';
import { MongoExceptionFilter } from './filters/mongo-exception.filter';
import { InAccountsService } from './in-accounts.service';
import { HideSensitiveDataInterceptor } from './interceptors/hide-sensitive-data.interceptor';

@UseGuards(JwtAuthGuard)
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
)
@UseFilters(MongoExceptionFilter)
@UseInterceptors(HideSensitiveDataInterceptor)
@ApiTags('linkedin/accounts')
@Controller('linkedin/accounts')
export class inAccountsController {
  private verificationFns: Record<string, (verificationCode: string) => Promise<void>>;
  private tempProxies: { accessKey: string; proxy: ProxyDocument }[];

  constructor(
    private readonly inAccountsService: InAccountsService,
    private readonly proxiesService: ProxiesService,
    private readonly schedulerService: SchedulerService,
  ) {
    this.verificationFns = {};
    this.tempProxies = [];
  }

  @Post()
  async create(@Req() req: Request, @Body() createInAccountDto: CreateInAccountDto) {
    const teamId = (req.user as any)?._doc?.teamId;
    let loginResponse = undefined;
    let proxy: ProxyDocument | undefined = undefined;

    // Get a proxy
    try {
      proxy = (await this.proxiesService.findAll()).find(
        ({ accoundId, host }) =>
          !accoundId && !this.tempProxies.some(({ proxy: tempProxy }) => tempProxy.host === host),
      );
      if (!proxy) {
        throw new Error();
      } else {
        this.tempProxies.push({
          accessKey: createInAccountDto.accessKey,
          proxy,
        });
      }
    } catch (error) {
      throw new HttpException('Failed to login. there is not available proxies right now', HttpStatus.BAD_REQUEST);
    }

    // Login
    try {
      loginResponse = await linkedinCore.account.login(
        createInAccountDto.accessKey,
        createInAccountDto.password,
        [],
        `${proxy.protocol}://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`,
      );
    } catch (error) {
      console.log('error1', error);
      this.tempProxies = this.tempProxies.filter(({ accessKey }) => createInAccountDto.accessKey !== accessKey);
      throw new HttpException(
        'Failed to login. Please, make sure that you provided the write credentials',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (typeof loginResponse === 'function') {
      this.verificationFns[createInAccountDto.accessKey] = loginResponse;
      return 'verificationCodeIsRequired';
    } else {
      const browser = loginResponse;
      return await this.afterLogin(teamId, browser, createInAccountDto);
    }
  }

  @Post('verify')
  async verify(@Req() req: Request, @Query('code') code: string, @Body() createInAccountDto: CreateInAccountDto) {
    const teamId = (req.user as any)?._doc?.teamId;
    try {
      if (
        !this.verificationFns[createInAccountDto.accessKey] ||
        typeof this.verificationFns[createInAccountDto.accessKey] !== 'function'
      ) {
        throw new HttpException('Failed to login. Two-Factor authentication error', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const browser = await this.verificationFns[createInAccountDto.accessKey](code);
      delete this.verificationFns[createInAccountDto.accessKey];
      return await this.afterLogin(teamId, browser, createInAccountDto);
    } catch (error) {
      throw new HttpException('Failed to login. Verification code is not correct', HttpStatus.BAD_REQUEST);
    }
  }

  @Post(':id/verify')
  async reverify(
    @Req() req: Request,
    @Query('code') code: string,
    @Query('accessKey') accessKey: string,
    @Param('id') id: string,
  ) {
    const teamId = (req.user as any)?._doc?.teamId;
    try {
      if (!this.verificationFns[accessKey] || typeof this.verificationFns[accessKey] !== 'function') {
        throw new HttpException('Failed to login. Two-Factor authentication error', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const browser = await this.verificationFns[accessKey](code);
      delete this.verificationFns[accessKey];
      return await this.afterReLogin(teamId, browser, id);
    } catch (error) {
      throw new HttpException('Failed to login. Verification code is not correct', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll(@Req() req: Request) {
    const teamId = (req.user as any)?._doc?.teamId;
    return this.inAccountsService.findAll(teamId);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    const teamId = (req.user as any)?._doc?.teamId;
    return this.inAccountsService.findOne(teamId, id);
  }

  @Patch(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() updateInAccountDto: UpdateInAccountDto) {
    const teamId = (req.user as any)?._doc?.teamId;
    const inAccount = await this.inAccountsService.update(teamId, id, updateInAccountDto);

    return inAccount;
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const teamId = (req.user as any)?._doc?.teamId;
    await this.inAccountsService.remove(teamId, id);

    const proxy = (await this.proxiesService.findAll()).find(({ accoundId }) => id === accoundId.toString());

    await this.proxiesService.update(proxy._id.toString(), { accoundId: null });

    return;
  }

  @Patch(':id/reconnect')
  async reconnect(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() reconnectDto: { accessKey: string; password: string },
  ) {
    const teamId = (req.user as any)?._doc?.teamId;
    const inAccount = await this.inAccountsService.findOne(teamId, id);

    // Get a proxy
    const proxy = await this.proxiesService.findOneByAccountId(JSON.parse(JSON.stringify(inAccount._id)));

    // Login
    let loginResponse = undefined;
    try {
      loginResponse = await linkedinCore.account.login(
        reconnectDto.accessKey,
        reconnectDto.password,
        [],
        `${proxy.protocol}://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`,
      );
    } catch (error) {
      this.tempProxies = this.tempProxies.filter(({ accessKey }) => reconnectDto.accessKey !== accessKey);
      console.log('reconnect', error);
      throw new HttpException(
        'Failed to login. Please, make sure that you provided the write credentials',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (typeof loginResponse === 'function') {
      this.verificationFns[reconnectDto.accessKey] = loginResponse;
      return 'verificationCodeIsRequired';
    } else {
      const browser = loginResponse;
      return await this.afterReLogin(teamId, browser, JSON.parse(JSON.stringify(inAccount._id)));
    }
  }

  private async afterLogin(
    teamId: mongoose.Schema.Types.ObjectId,
    browser: any,
    createInAccountDto: CreateInAccountDto,
  ) {
    let data;

    // Scrape Account Data
    try {
      data = await linkedinCore.account.getData(browser.driver);
      console.log('just got data and gonna logout');
      await linkedinCore.account.logout(browser.driver);
      console.log('FINISHED LOGGIN OUT');
      await browser.quit();
    } catch (error) {
      console.log('ERROR');
      await linkedinCore.account.logout(browser.driver);
      await browser.quit();
      this.tempProxies = this.tempProxies.filter(({ accessKey }) => createInAccountDto.accessKey !== accessKey);
      throw new HttpException(
        'Failed to login. Please, make sure that you provided the correct credentials',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Assign Account DB
    const inAccount = await this.inAccountsService.create(teamId, {
      ...createInAccountDto,
      cookies: browser.cookies,
      fullName: data?.fullName || 'Anonymous',
      email: data?.email || 'anonymous@email.com',
      photoUrl: data?.photoUrl || 'https://rigaon.lv/wp-content/themes/noo-citilights/assets/images/default-avatar.png',
    });

    let tempProxy: ProxyDocument;
    this.tempProxies = this.tempProxies.filter(({ accessKey, proxy }) => {
      if (inAccount.accessKey !== accessKey) {
        return true;
      }
      tempProxy = proxy;
      return false;
    });

    await this.proxiesService.update(tempProxy._id.toString(), {
      accoundId: inAccount._id.toString(),
    });

    return inAccount;
  }

  private async afterReLogin(teamId: mongoose.Schema.Types.ObjectId, browser: any, inAccountId: string) {
    let data;

    // Scrape Account Data
    try {
      data = await linkedinCore.account.getData(browser.driver);
      await linkedinCore.account.logout(browser.driver);
      await browser.quit();
    } catch (error) {
      await linkedinCore.account.logout(browser.driver);
      await browser.quit();
      throw new HttpException(
        'Failed to login. Please, make sure that you provided the correct credentials',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Assign Account DB
    console.log(teamId, inAccountId);
    const inAccount = await this.inAccountsService.updateLoginInfo(teamId, inAccountId, {
      cookies: browser.cookies,
      fullName: data?.fullName || 'Anonymous',
      email: data?.email || 'anonymous@email.com',
      photoUrl: data?.photoUrl || 'https://rigaon.lv/wp-content/themes/noo-citilights/assets/images/default-avatar.png',
    });

    return inAccount;
  }
}
