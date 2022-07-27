import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { getExtrinsicsStat } from './transfers.queries';
import { TransfersStats } from '../../common/entities/TransfersStats';
import { GqlService } from '../../common/gqlService';
import { AppConfigService } from '../utils/app-config.service';
import { UtilsService } from '../utils/utils.service';

enum ExtrinsicsStatsTypeEnum {
  COINS = 'COINS',
  TOKENS = 'TOKENS',
  TRANSACTIONS = 'TRANSACTIONS',
}

interface ITransferResponse {
  data: {
    extrinsicsStatistics: {
      data: {
        date: Date;
        count: number;
      }[];
    };
  };
}

@Injectable()
export class TransfersService {
  constructor(
    @InjectRepository(TransfersStats) private repo: Repository<TransfersStats>,
    private readonly appConfigService: AppConfigService,
    private readonly utils: UtilsService,
  ) {}

  @Cron('10 * * * *')
  async transactionsCron() {
    const chains = this.appConfigService.CHAINS;
    for (const { url, name } of chains) {
      try {
        await this.stats(url, name);
      } catch {
        continue;
      }
    }
  }

  @Cron('15 * * * *')
  async coinsTransferCron() {
    const chains = this.appConfigService.CHAINS;
    for (const { url, name } of chains) {
      try {
        await this.stats(url, name, ExtrinsicsStatsTypeEnum.COINS);
      } catch {
        continue;
      }
    }
  }

  @Cron('20 * * * *')
  async tokensTransferCron() {
    const chains = this.appConfigService.CHAINS;
    for (const { url, name } of chains) {
      try {
        await this.stats(url, name, ExtrinsicsStatsTypeEnum.TOKENS);
      } catch {
        continue;
      }
    }
  }

  private async stats(
    url: string,
    chainName: string,
    type?: ExtrinsicsStatsTypeEnum,
  ) {
    const lastToken = await this.repo.findOne({
      where: {
        chain: chainName,
        type,
      },
      order: {
        timestamp: 'DESC',
      },
    });

    const result = await GqlService.makeRequest<ITransferResponse>(
      url,
      getExtrinsicsStat,
      {
        fromDate: this.utils.formatTimestampToDate(lastToken?.timestamp),
        type,
      },
    );

    await this.repo.upsert(
      result.data.data.extrinsicsStatistics.data.map((item) => ({
        ...item,
        timestamp: this.utils.formatDateToTimestamp(item.date),
        chain: chainName,
        type: type ?? ExtrinsicsStatsTypeEnum.TRANSACTIONS,
      })),
      ['chain', 'timestamp', 'type'],
    );
  }
}
