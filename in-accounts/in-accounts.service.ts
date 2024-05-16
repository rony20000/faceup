import { CryptoService } from '@app/crypto/index';
import * as mongoose from 'mongoose';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInAccountDto } from './dto/create-in-account.dto';
import { UpdateInAccountDto } from './dto/update-in-account.dto';
import {
  inAccountLimits,
  inAccountLimitsDocument,
} from './schemas/in-account-limits.schema';
import { InAccount, InAccountDocument } from './schemas/in-account.schema';
import { InCampaignsService } from '../in-campaigns/in-campaigns.service';

@Injectable()
export class InAccountsService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(InAccount.name)
    private readonly inAccountModel: Model<InAccountDocument>,
    @InjectModel(inAccountLimits.name)
    private readonly inAccountLimitsModel: Model<inAccountLimitsDocument>,
    private readonly inCampaignsService: InCampaignsService,
  ) {}

  async create(
    teamId: mongoose.Schema.Types.ObjectId,
    createInAccountDto: CreateInAccountDto & {
      cookies: object;
      fullName: string;
      email: string;
      photoUrl: string;
    },
  ) {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();
      const createdInAccountLimits = new this.inAccountLimitsModel({
        ...createInAccountDto.limits,
      });
      const savedInAccountLimits = await createdInAccountLimits.save({
        session,
      });

      const encryptedPassword = await CryptoService.encrypt(
        createInAccountDto.password,
      );
      createInAccountDto.password = undefined;
      const createdInAccount = new this.inAccountModel({
        ...createInAccountDto,
        encryptedPassword,
        limits: savedInAccountLimits._id,
        teamId,
      });
      const savedInAccount = await createdInAccount.save({ session });
      await session.commitTransaction();

      return JSON.parse(
        JSON.stringify({
          ...savedInAccount.toJSON(),
          limits: { ...savedInAccountLimits.toJSON() },
        }),
      );
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async findAll(teamId: mongoose.Schema.Types.ObjectId) {
    const inAccounts = await this.inAccountModel.find(
      { teamId },
      { teamId: 0 },
      {
        populate: ['limits'],
      },
    );

    return inAccounts;
  }

  async findOne(teamId: mongoose.Schema.Types.ObjectId, id: string) {
    const inAccount = await this.inAccountModel.findById(id, undefined, {
      populate: ['limits'],
    });

    if (!inAccount) {
      throw new NotFoundException();
    }

    if (JSON.stringify(inAccount.teamId) !== JSON.stringify(teamId)) {
      throw new UnauthorizedException();
    }

    return inAccount;
  }

  async findByAccessKey(
    teamId: mongoose.Schema.Types.ObjectId,
    accessKey: string,
  ) {
    const inAccount = await this.inAccountModel.findOne({ accessKey });

    if (!inAccount) {
      throw new NotFoundException();
    }

    if (JSON.stringify(inAccount.teamId) !== JSON.stringify(teamId)) {
      throw new UnauthorizedException();
    }

    return inAccount;
  }

  async update(
    teamId: mongoose.Schema.Types.ObjectId,
    id: string,
    updateInAccountDto: UpdateInAccountDto,
  ) {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();
      const inAccount = await this.findOne(teamId, id);
      await this.inAccountLimitsModel.findByIdAndUpdate(
        inAccount.limits,
        updateInAccountDto.limits,
        { session },
      );

      delete updateInAccountDto.limits;
      await inAccount.updateOne(updateInAccountDto, {
        session,
      });
      await session.commitTransaction();

      return this.findOne(teamId, id);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async updateLoginInfo(
    teamId: mongoose.Schema.Types.ObjectId,
    id: string,
    updateInAccountDto: {
      cookies: any[];
      fullName: string;
      email: string;
      photoUrl: string;
    },
  ) {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();
      const inAccount = await this.findOne(teamId, id);
      await inAccount.updateOne(
        { ...updateInAccountDto, isConnected: true },
        {
          session,
        },
      );
      await session.commitTransaction();

      return this.findOne(teamId, id);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async remove(teamId: mongoose.Schema.Types.ObjectId, id: string) {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();
      const inAccount = await this.findOne(teamId, id);
      await this.inAccountLimitsModel.findByIdAndRemove(inAccount.limits, {
        session,
      });
      await inAccount.deleteOne({ session });

      // await this.inCampaignsService.removeInAccountId(
      //   inAccount._id.toString(),
      //   session,
      // );

      await session.commitTransaction();

      return;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
