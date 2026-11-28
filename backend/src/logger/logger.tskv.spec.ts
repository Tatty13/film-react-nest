import { LogLevel } from '@nestjs/common';

import { LogType } from './logger-base';
import { TskvLogger } from './logger.tskv';

const logMethods: {
  level: LogLevel;
  output: LogType;
  write: (logger: TskvLogger) => void;
}[] = [
  {
    level: 'log',
    output: 'log',
    write: (logger: TskvLogger) => logger.log('message log', 'context'),
  },
  {
    level: 'error',
    output: 'error',
    write: (logger: TskvLogger) => logger.error('message error', 'context'),
  },
  {
    level: 'warn',
    output: 'warn',
    write: (logger: TskvLogger) => logger.warn('message warn', 'context'),
  },
  {
    level: 'debug',
    output: 'debug',
    write: (logger: TskvLogger) => logger.debug('message debug', 'context'),
  },
  {
    level: 'verbose',
    output: 'log',
    write: (logger: TskvLogger) => logger.verbose('message verbose', 'context'),
  },
  {
    level: 'fatal',
    output: 'error',
    write: (logger: TskvLogger) => logger.fatal?.('message fatal', 'context'),
  },
];

describe('TskvLogger', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('форматирует поля как пары ключ-значение, разделённые табуляцией', () => {
    const output = jest.spyOn(console, 'log').mockImplementation();
    const logger = new TskvLogger();

    logger.log('started', { id: 1 });

    expect(output).toHaveBeenCalledWith(
      'level=log\tmessage=started\toptionalParams=[{"id":1}]',
    );
  });

  it('экранирует обратные слеши и управляющие символы', () => {
    const output = jest.spyOn(console, 'log').mockImplementation();
    const logger = new TskvLogger();

    logger.log('a\\b\tc\r\nd');

    expect(output).toHaveBeenCalledWith('level=log\tmessage=a\\\\b\\tc\\r\\nd');
  });

  it('форматирует ошибки через стек вызовов', () => {
    const output = jest.spyOn(console, 'error').mockImplementation();
    const logger = new TskvLogger();
    const error = new Error('failed');

    logger.error(error);

    expect(output).toHaveBeenCalledWith(
      expect.stringMatching(/^level=error\tmessage=Error: failed(?:\\n|$)/),
    );
  });

  it('преобразует циклические объекты в строку при ошибке сериализации', () => {
    const output = jest.spyOn(console, 'log').mockImplementation();
    const logger = new TskvLogger();
    const circular: { self?: unknown } = {};
    circular.self = circular;

    logger.log(circular);

    expect(output).toHaveBeenCalledWith('level=log\tmessage=[object Object]');
  });

  it.each(logMethods)(
    'выводит записи уровня $level через console.$output',
    ({ level, output: outputMethod, write }) => {
      const output = jest.spyOn(console, outputMethod).mockImplementation();

      write(new TskvLogger());

      expect(output).toHaveBeenCalledWith(
        `level=${level}\tmessage=message ${level}\toptionalParams=["context"]`,
      );
    },
  );
});
