import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import typeormConfig from '../common/typeorm.config';
import { TokenModule } from './tokens/token.module';
import { CollectionsModule } from './collections/collections.module';
import { TransfersModule } from './transfers/transfers.module';
import { envValidate } from './utils/env.validation';
import { UtilsModule } from './utils/utils.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validate: envValidate }),
    TypeOrmModule.forRoot({
      ...typeormConfig,
    }),
    ScheduleModule.forRoot(),
    TokenModule,
    CollectionsModule,
    TransfersModule,
    UtilsModule,
    AccountsModule,
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule {}
