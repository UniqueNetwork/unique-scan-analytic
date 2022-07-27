import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { GqlService } from '../../common/gqlService';
import { CollectionsStats } from '../../common/entities/CollectionsStats';
import { getCollectionsStats } from './collections.queries';
import { AppConfigService } from '../utils/app-config.service';
import { UtilsService } from '../utils/utils.service';

interface ICollectionResponse {
  data: {
    collectionsStatistics: {
      data: {
        date: Date;
        count: number;
      }[];
    };
  };
}

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(CollectionsStats)
    private repo: Repository<CollectionsStats>,
    private readonly appConfigService: AppConfigService,
    private readonly utils: UtilsService,
  ) {}

  @Cron('0 * * * *')
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
    const lastItem = await this.repo.findOne({
      where: {
        chain: chainName,
      },
      order: {
        timestamp: 'DESC',
      },
    });

    const result = await GqlService.makeRequest<ICollectionResponse>(
      url,
      getCollectionsStats,
      {
        fromDate: this.utils.formatTimestampToDate(lastItem?.timestamp),
      },
    );

    await this.repo.upsert(
      result.data.data.collectionsStatistics.data.map((item) => ({
        ...item,
        timestamp: this.utils.formatDateToTimestamp(item.date),
        chain: chainName,
      })),
      ['chain', 'timestamp'],
    );
  }
}
