import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
  formatMessage(level: string, message: unknown, optionalParams: unknown[]) {
    return JSON.stringify({ level, message, optionalParams });
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('log', message, optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('error', message, optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('warn', message, optionalParams));
  }

  debug?(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('debug', message, optionalParams));
  }

  verbose?(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('verbose', message, optionalParams));
  }
}
