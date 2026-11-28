import { Injectable, LogLevel } from '@nestjs/common';

import { BaseLogger } from './logger-base';

@Injectable()
export class TskvLogger extends BaseLogger {
  protected formatMessage(
    level: LogLevel,
    message: unknown,
    optionalParams: unknown[],
  ) {
    const fields = [
      `level=${this.formatValue(level)}`,
      `message=${this.formatValue(message)}`,
    ];

    if (optionalParams.length > 0) {
      fields.push(`optionalParams=${this.formatValue(optionalParams)}`);
    }

    return fields.join('\t');
  }

  private formatValue(value: unknown): string {
    let formatted: string;

    if (typeof value === 'string') {
      formatted = value;
    } else if (value instanceof Error) {
      formatted = value.stack ?? value.message;
    } else if (typeof value === 'object' && value !== null) {
      try {
        formatted = JSON.stringify(value);
      } catch {
        formatted = String(value);
      }
    } else {
      formatted = String(value);
    }

    return formatted
      .replace(/\\/g, '\\\\')
      .replace(/\t/g, '\\t')
      .replace(/\r/g, '\\r')
      .replace(/\n/g, '\\n');
  }
}
