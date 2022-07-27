import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AccountsStats } from '../common/entities/AccountsStats';
import { TokensStats } from '../common/entities/TokensStats';
import { TransfersStats } from '../common/entities/TransfersStats';
import typeormConfig from '../common/typeorm.config';
import { TokenModule } from './tokens/token.module';
import { CollectionsModule } from './collections/collections.module';
import { CollectionsStats } from '../common/entities/CollectionsStats';
import { TransfersModule } from './transfers/transfers.module';
import { envValidate } from './utils/env.validation';
import { UtilsModule } from './utils/utils.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validate: envValidate }),
    TypeOrmModule.forRoot({
      ...typeormConfig,
      entities: [
        AccountsStats,
        TokensStats,
        TransfersStats,
        CollectionsStats,
        TransfersStats,
      ],
    }),
    ScheduleModule.forRoot(),
    TokenModule,
    CollectionsModule,
    TransfersModule,
    UtilsModule,
    AccountsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
