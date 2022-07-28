import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { TokensStats } from '../../common/entities/TokensStats';
import { GqlService } from '../../common/gqlService';
import { getTokensStat } from './token.queries';
import { AppConfigService } from '../utils/app-config.service';
import { UtilsService } from '../utils/utils.service';

interface ITokensResponse {
  data: {
    tokenStatistics: {
      data: {
        date: Date;
        count: number;
      }[];
    };
  };
}

@Injectable()
export class TokenService {
  private readonly logger = new Logger('CollectionsService');

  constructor(
    @InjectRepository(TokensStats) private repo: Repository<TokensStats>,
    private readonly appConfigService: AppConfigService,
    private readonly utils: UtilsService,
  ) {}

  @Cron('5 * * * *')
  async tokensCron() {
    const chains = this.appConfigService.CHAINS;
    for (const { url, name } of chains) {
      try {
        await this.stats(url, name);
      } catch (e) {
        this.logger.error({ message: e.message });
      }
    }
  }

  private async stats(url: string, chainName: string) {
    const lastToken = await this.repo.findOne({
      where: {
        chain: chainName,
      },
      order: {
        timestamp: 'DESC',
      },
    });

    const result = await GqlService.makeRequest<ITokensResponse>(
      url,
      getTokensStat,
      {
        fromDate: this.utils.formatTimestampToDate(lastToken?.timestamp),
      },
    );

    await this.repo.upsert(
      result.data.data.tokenStatistics.data.map((item) => ({
        ...item,
        timestamp: this.utils.formatDateToTimestamp(item.date),
        chain: chainName,
      })),
      ['chain', 'timestamp'],
    );
  }
}
