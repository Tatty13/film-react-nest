import { Module } from '@nestjs/common';

import { FilmRepositoryModule } from 'src/repository/film/film.repository.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [FilmRepositoryModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
