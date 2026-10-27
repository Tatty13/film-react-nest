import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import {
  FILMS_REPOSITORY,
  FilmsRepository,
} from 'src/repository/film/films.repository';
import { toSeatKey } from 'src/common/utils/seat-key.util';
import {
  CreateOrderDto,
  CreateOrderTicketDto,
  ResponseCreateOrderDto,
  OrderResultDto,
} from './dto/order.dto';
import { ScheduleDto } from 'src/films/dto/films.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: FilmsRepository,
  ) {}

  async createOrder(order: CreateOrderDto): Promise<ResponseCreateOrderDto> {
    const tickets = order.tickets;
    const requestedSeats = new Set<string>();

    for (const ticket of tickets) {
      const seatKey = toSeatKey(ticket.row, ticket.seat);
      const requestedSeat = `${ticket.film}:${ticket.session}:${seatKey}`;

      if (requestedSeats.has(requestedSeat)) {
        throw new BadRequestException(`Место ${seatKey} указано дважды`);
      }
      requestedSeats.add(requestedSeat);
    }

    const bookings: Array<{
      ticket: CreateOrderTicketDto;
      daytime: string;
      price: number;
    }> = [];
    for (const ticket of tickets) {
      const session = await this.getValidatedSession(ticket);

      bookings.push({
        ticket,
        daytime: session.daytime,
        price: session.price,
      });
    }

    const items: OrderResultDto[] = [];
    for (const booking of bookings) {
      const { ticket, daytime, price } = booking;
      const reserved = await this.filmsRepository.reserveSeat({
        filmId: ticket.film,
        sessionId: ticket.session,
        row: ticket.row,
        seat: ticket.seat,
      });
      if (!reserved) {
        throw new ConflictException('Указанное место уже забронировано');
      }

      items.push(this.toOrderResult(ticket, daytime, price));
    }

    return { total: items.length, items };
  }

  private async getValidatedSession(
    ticket: CreateOrderTicketDto,
  ): Promise<ScheduleDto> {
    const film = await this.filmsRepository.findById(ticket.film);
    if (!film) {
      throw new NotFoundException(`Фильм ${ticket.film} не найден`);
    }

    const session = film.schedule.find(
      (scheduledSession) => scheduledSession.id === ticket.session,
    );

    if (!session) {
      throw new NotFoundException(`Сеанс ${ticket.session} не найден`);
    }
    if (ticket.row > session.rows || ticket.seat > session.seats) {
      throw new BadRequestException('Указано некорректное место');
    }
    if (session.taken.includes(toSeatKey(ticket.row, ticket.seat))) {
      throw new ConflictException('Указанное место уже забронировано');
    }

    return session;
  }

  private toOrderResult(
    ticket: CreateOrderTicketDto,
    daytime: string,
    price: number,
  ): OrderResultDto {
    return {
      id: randomUUID(),
      film: ticket.film,
      session: ticket.session,
      daytime,
      row: ticket.row,
      seat: ticket.seat,
      price,
    };
  }
}
