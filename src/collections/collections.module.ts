import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionsService } from './collections.service';
import { CollectionsStats } from '../../common/entities/CollectionsStats';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [UtilsModule, TypeOrmModule.forFeature([CollectionsStats])],
  providers: [CollectionsService],
  exports: [CollectionsService],
})
export class CollectionsModule {}
