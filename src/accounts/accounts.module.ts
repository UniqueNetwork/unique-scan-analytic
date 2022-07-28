import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsService } from './accounts.service';
import { UtilsModule } from '../utils/utils.module';
import { AccountsStats } from '../../common/entities/AccountsStats';

@Module({
  imports: [UtilsModule, TypeOrmModule.forFeature([AccountsStats])],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
