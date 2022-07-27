import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransfersService } from './transfers.service';
import { TransfersStats } from '../../common/entities/TransfersStats';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [UtilsModule, TypeOrmModule.forFeature([TransfersStats])],
  providers: [TransfersService],
  exports: [TransfersService],
})
export class TransfersModule {}
