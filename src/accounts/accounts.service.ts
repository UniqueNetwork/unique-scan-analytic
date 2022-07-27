import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { GqlService } from '../../common/gqlService';
import { getAccountsStats } from './accounts.queries';
import { AppConfigService } from '../utils/app-config.service';
import { UtilsService } from '../utils/utils.service';
import { AccountsStats } from '../../common/entities/AccountsStats';

interface ICollectionResponse {
  data: {
    accountsStatistics: {
      data: {
        date: Date;
        count: number;
      }[];
    };
  };
}

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountsStats)
    private repo: Repository<AccountsStats>,
    private readonly appConfigService: AppConfigService,
    private readonly utils: UtilsService,
  ) {}

  @Cron('25 * * * *')
  async collectionCron() {
    const chains = this.appConfigService.CHAINS;
    for (const { url, name } of chains) {
      try {
        await this.stats(url, name);
      } catch (e) {
        continue;
      }
    }
  }

  private async stats(url: string, chainName: string) {
    const lastCollection = await this.repo.findOne({
      where: {
        chain: chainName,
      },
      order: {
        timestamp: 'DESC',
      },
    });

    const result = await GqlService.makeRequest<ICollectionResponse>(
      url,
      getAccountsStats,
      {
        fromDate: this.utils.formatTimestampToDate(lastCollection?.timestamp),
      },
    );

    await this.repo.upsert(
      result.data.data.accountsStatistics.data.map((item) => ({
        ...item,
        timestamp: this.utils.formatDateToTimestamp(item.date),
        chain: chainName,
      })),
      ['chain', 'timestamp'],
    );
  }
}
