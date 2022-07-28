import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppConfigService } from './app-config.service';
import { UtilsService } from './utils.service';

@Module({
  imports: [ConfigModule],
  providers: [AppConfigService, UtilsService],
  exports: [AppConfigService, UtilsService],
})
export class UtilsModule {}
