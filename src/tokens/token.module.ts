import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from './token.service';
import { TokensStats } from '../../common/entities/TokensStats';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [UtilsModule, TypeOrmModule.forFeature([TokensStats])],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
