import { LoggerService, LogLevel } from '@nestjs/common';

export type LogType = 'log' | 'error' | 'warn' | 'debug';

const levelMap: Record<LogLevel, LogType> = {
  log: 'log',
  error: 'error',
  warn: 'warn',
  debug: 'debug',
  verbose: 'log',
  fatal: 'error',
};

export abstract class BaseLogger implements LoggerService {
  protected abstract formatMessage(
    level: string,
    message: unknown,
    optionalParams: unknown[],
  ): string;

  log(message: unknown, ...optionalParams: unknown[]) {
    console[levelMap.log](this.formatMessage('log', message, optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    console[levelMap.error](
      this.formatMessage('error', message, optionalParams),
    );
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    console[levelMap.warn](this.formatMessage('warn', message, optionalParams));
  }

  debug?(message: unknown, ...optionalParams: unknown[]) {
    console[levelMap.debug](
      this.formatMessage('debug', message, optionalParams),
    );
  }

  verbose?(message: unknown, ...optionalParams: unknown[]) {
    console[levelMap.verbose](
      this.formatMessage('verbose', message, optionalParams),
    );
  }

  fatal?(message: unknown, ...optionalParams: unknown[]) {
    console[levelMap.fatal](
      this.formatMessage('fatal', message, optionalParams),
    );
  }
}
