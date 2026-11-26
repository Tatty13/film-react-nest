import { TskvLogger } from './logger.tskv';

const logMethods = [
  {
    level: 'log',
    write: (logger: TskvLogger) => logger.log('message log', 'context'),
  },
  {
    level: 'error',
    write: (logger: TskvLogger) => logger.error('message error', 'context'),
  },
  {
    level: 'warn',
    write: (logger: TskvLogger) => logger.warn('message warn', 'context'),
  },
  {
    level: 'debug',
    write: (logger: TskvLogger) => logger.debug('message debug', 'context'),
  },
  {
    level: 'verbose',
    write: (logger: TskvLogger) => logger.verbose('message verbose', 'context'),
  },
];

describe('TskvLogger', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('форматирует поля как пары ключ-значение, разделённые табуляцией', () => {
    const logger = new TskvLogger();

    expect(logger.formatMessage('info', 'started', { id: 1 })).toBe(
      'level=info\tmessage=started\toptionalParams=[{"id":1}]',
    );
  });

  it('экранирует обратные слеши и управляющие символы', () => {
    const logger = new TskvLogger();

    expect(logger.formatMessage('info', 'a\\b\tc\r\nd')).toBe(
      'level=info\tmessage=a\\\\b\\tc\\r\\nd',
    );
  });

  it('форматирует ошибки через стек вызовов', () => {
    const logger = new TskvLogger();

    expect(logger.formatMessage('error', new Error('failed'))).toMatch(
      /^level=error\tmessage=Error: failed(?:\\n|$)/,
    );
  });

  it('преобразует циклические объекты в строку при ошибке сериализации', () => {
    const logger = new TskvLogger();
    const circular: { self?: unknown } = {};
    circular.self = circular;

    expect(logger.formatMessage('info', circular)).toBe(
      'level=info\tmessage=[object Object]',
    );
  });

  it.each(logMethods)('выводит записи уровня $level', ({ level, write }) => {
    const output = jest.spyOn(console, 'log').mockImplementation();

    write(new TskvLogger());

    expect(output).toHaveBeenCalledWith(
      `level=${level}\tmessage=message ${level}\toptionalParams=["context"]`,
    );
  });
});
