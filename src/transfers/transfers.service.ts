import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger('TransfersService');

  constructor(
    @InjectRepository(TransfersStats) private repo: Repository<TransfersStats>,
    private readonly appConfigService: AppConfigService,
    private readonly utils: UtilsService,
  ) {}

  @Cron('10 * * * *')
  async transactionsCron() {
    await this.runCron();
  }

  @Cron('15 * * * *')
  async coinsTransferCron() {
    await this.runCron(ExtrinsicsStatsTypeEnum.COINS);
  }

  @Cron('20 * * * *')
  async tokensTransferCron() {
    await this.runCron(ExtrinsicsStatsTypeEnum.TOKENS);
  }

  private async runCron(type?: ExtrinsicsStatsTypeEnum) {
    const chains = this.appConfigService.CHAINS;
    for (const { url, name } of chains) {
      try {
        await this.stats(url, name, type);
      } catch (e) {
        this.logger.error({ message: e.message });
      }
    }
  }

  private async stats(
    url: string,
    chainName: string,
    type?: ExtrinsicsStatsTypeEnum,
  ) {
    const lastItem = await this.repo.findOne({
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
        fromDate: this.utils.formatTimestampToDate(lastItem?.timestamp),
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
