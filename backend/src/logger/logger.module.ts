import { LoggerService, Module, Type } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DevLogger } from './logger.dev';
import { JsonLogger } from './logger.json';
import { TskvLogger } from './logger.tskv';

export const APP_LOGGER = 'APP_LOGGER';

const loggerMap: Record<string, Type<LoggerService>> = {
  dev: DevLogger,
  json: JsonLogger,
  tskv: TskvLogger,
};

@Module({
  imports: [ConfigModule],
  providers: [
    DevLogger,
    JsonLogger,
    TskvLogger,
    {
      provide: APP_LOGGER,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): LoggerService => {
        const type = configService.get<string>('LOGGER');
        const Logger = loggerMap[type?.trim().toLowerCase()] ?? DevLogger;
        return new Logger();
      },
    },
  ],
  exports: [APP_LOGGER],
})
export class LoggerModule {}
