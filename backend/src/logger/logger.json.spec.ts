import { JsonLogger } from './logger.json';

const logMethods = [
  {
    level: 'log',
    write: (logger: JsonLogger) => logger.log('message log', 'context'),
  },
  {
    level: 'error',
    write: (logger: JsonLogger) => logger.error('message error', 'context'),
  },
  {
    level: 'warn',
    write: (logger: JsonLogger) => logger.warn('message warn', 'context'),
  },
  {
    level: 'debug',
    write: (logger: JsonLogger) => logger.debug('message debug', 'context'),
  },
  {
    level: 'verbose',
    write: (logger: JsonLogger) => logger.verbose('message verbose', 'context'),
  },
];

describe('JsonLogger', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('формирует JSON с уровнем, сообщением и дополнительными параметрами', () => {
    const logger = new JsonLogger();

    expect(logger.formatMessage('warn', 'request failed', [{ id: 1 }])).toBe(
      '{"level":"warn","message":"request failed","optionalParams":[{"id":1}]}',
    );
  });

  it.each(logMethods)('выводит записи уровня $level', ({ level, write }) => {
    const output = jest
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);

    write(new JsonLogger());

    expect(output).toHaveBeenCalledWith(
      JSON.stringify({
        level,
        message: `message ${level}`,
        optionalParams: ['context'],
      }),
    );
  });
});
