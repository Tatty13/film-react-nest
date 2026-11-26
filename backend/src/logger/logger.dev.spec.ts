import { ConsoleLogger } from '@nestjs/common';

import { DevLogger } from './logger.dev';

describe('DevLogger', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('использует вывод Nest ConsoleLogger', () => {
    const write = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
    const logger = new DevLogger();

    logger.log('server started');

    expect(logger).toBeInstanceOf(ConsoleLogger);
    expect(write).toHaveBeenCalledWith(expect.stringContaining('[Nest]'));
    expect(write).toHaveBeenCalledWith(
      expect.stringContaining('server started'),
    );
  });
});
