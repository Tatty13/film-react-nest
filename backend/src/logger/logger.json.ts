import { Injectable, LogLevel } from '@nestjs/common';

import { BaseLogger } from './logger-base';

@Injectable()
export class JsonLogger extends BaseLogger {
  protected formatMessage(
    level: LogLevel,
    message: unknown,
    optionalParams: unknown[],
  ) {
    return JSON.stringify({ level, message, optionalParams });
  }
}
