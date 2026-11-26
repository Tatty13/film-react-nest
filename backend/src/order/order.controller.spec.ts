import { Test, TestingModule } from '@nestjs/testing';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto, ResponseCreateOrderDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: {
    createOrder: jest.Mock;
  };

  beforeEach(async () => {
    orderService = {
      createOrder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: orderService,
        },
      ],
    }).compile();

    controller = module.get(OrderController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('createOrder передает DTO в сервис и возвращает результат', async () => {
    const dto: CreateOrderDto = {
      email: 'test@test.com',
      phone: '+79998887766',
      tickets: [
        {
          film: 'film-1',
          session: 'session-1',
          row: 1,
          seat: 2,
        },
      ],
    };
    const response: ResponseCreateOrderDto = {
      total: 1,
      items: [
        {
          id: 'order-1',
          film: 'film-1',
          session: 'session-1',
          daytime: '2026-11-26T23:00:00.000Z',
          row: 1,
          seat: 2,
          price: 500,
        },
      ],
    };
    orderService.createOrder.mockResolvedValue(response);

    await expect(controller.createOrder(dto)).resolves.toEqual(response);
    expect(orderService.createOrder).toHaveBeenCalledWith(dto);
  });

  it('createOrder передает ошибку сервиса вызывающему коду', async () => {
    const dto: CreateOrderDto = {
      tickets: [],
    };
    const error = new Error('Invalid order');
    orderService.createOrder.mockRejectedValue(error);

    await expect(controller.createOrder(dto)).rejects.toBe(error);
  });
});
