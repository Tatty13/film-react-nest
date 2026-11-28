import { LogLevel } from '@nestjs/common';

import { LogType } from './logger-base';
import { JsonLogger } from './logger.json';

const logMethods: {
  level: LogLevel;
  output: LogType;
  write: (logger: JsonLogger) => void;
}[] = [
  {
    level: 'log',
    output: 'log',
    write: (logger: JsonLogger) => logger.log('message log', 'context'),
  },
  {
    level: 'error',
    output: 'error',
    write: (logger: JsonLogger) => logger.error('message error', 'context'),
  },
  {
    level: 'warn',
    output: 'warn',
    write: (logger: JsonLogger) => logger.warn('message warn', 'context'),
  },
  {
    level: 'debug',
    output: 'debug',
    write: (logger: JsonLogger) => logger.debug('message debug', 'context'),
  },
  {
    level: 'verbose',
    output: 'log',
    write: (logger: JsonLogger) => logger.verbose('message verbose', 'context'),
  },
  {
    level: 'fatal',
    output: 'error',
    write: (logger: JsonLogger) => logger.fatal?.('message fatal', 'context'),
  },
];

describe('JsonLogger', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('формирует JSON с уровнем, сообщением и дополнительными параметрами', () => {
    const output = jest.spyOn(console, 'warn').mockImplementation();
    const logger = new JsonLogger();

    logger.warn('request failed', { id: 1 });

    expect(output).toHaveBeenCalledWith(
      '{"level":"warn","message":"request failed","optionalParams":[{"id":1}]}',
    );
  });

  it.each(logMethods)(
    'выводит записи уровня $level через console.$output',
    ({ level, output: outputMethod, write }) => {
      const output = jest
        .spyOn(console, outputMethod)
        .mockImplementation(() => undefined);

      write(new JsonLogger());

      expect(output).toHaveBeenCalledWith(
        JSON.stringify({
          level,
          message: `message ${level}`,
          optionalParams: ['context'],
        }),
      );
    },
  );
});
