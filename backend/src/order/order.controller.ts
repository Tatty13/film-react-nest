import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { CreateOrderDto, ResponseCreateOrderDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  createOrder(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<ResponseCreateOrderDto> {
    return this.orderService.createOrder(createOrderDto);
  }
}
