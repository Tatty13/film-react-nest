import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  formatMessage(level: string, message: unknown, ...optionalParams: unknown[]) {
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

  log(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('warn', message, ...optionalParams));
  }

  debug?(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose?(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
}
