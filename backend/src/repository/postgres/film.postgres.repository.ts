import * as path from 'node:path';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { toSeatKey } from 'src/common/utils/seat-key.util';
import {
  FilmDto,
  FilmWithScheduleDto,
  ScheduleDto,
} from 'src/films/dto/films.dto';
import { Film } from 'src/films/entities/film.entity';
import { Schedule } from 'src/films/entities/schedule.entity';

import { FilmsRepository, ReserveSeatParams } from '../films.repository';

class SeatReservationConflictError extends Error {}

@Injectable()
export class FilmPostgresRepository implements FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly films: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly schedules: Repository<Schedule>,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.films.find();
    return films.map((film) => this.toFilmDto(film));
  }

  async findById(id: string): Promise<FilmWithScheduleDto | null> {
    const film = await this.films.findOne({
      where: { id },
      relations: { schedule: true },
    });

    if (!film) {
      return null;
    }

    return {
      ...this.toFilmDto(film),
      schedule: [...film.schedule]
        .sort(
          (first, second) =>
            Date.parse(first.daytime) - Date.parse(second.daytime),
        )
        .map((schedule) => this.toScheduleDto(schedule)),
    };
  }

  async reserveSeat({
    filmId,
    sessionId,
    row,
    seat,
  }: ReserveSeatParams): Promise<boolean> {
    return this.reserveSeats([{ filmId, sessionId, row, seat }]);
  }

  async reserveSeats(params: ReserveSeatParams[]): Promise<boolean> {
    try {
      await this.schedules.manager.transaction(async (manager) => {
        const schedules = manager.getRepository(Schedule);

        for (const { filmId, sessionId, row, seat } of params) {
          const seatKey = toSeatKey(row, seat);
          const result = await schedules
            .createQueryBuilder()
            .update(Schedule)
            .set({ taken: () => 'array_append(taken, :seatKey)' })
            .where('id = :sessionId', { sessionId })
            .andWhere('"filmId" = :filmId', { filmId })
            .andWhere('rows >= :row', { row })
            .andWhere('seats >= :seat', { seat })
            .andWhere('NOT (:seatKey = ANY(taken))', { seatKey })
            .execute();

          if (result.affected !== 1) {
            throw new SeatReservationConflictError();
          }
        }
      });

      return true;
    } catch (error) {
      if (error instanceof SeatReservationConflictError) {
        return false;
      }

      throw error;
    }
  }

  private toFilmDto(film: Film): FilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: this.toAssetPath(film.image),
      cover: this.toAssetPath(film.cover),
    };
  }

  private toScheduleDto(schedule: Schedule): ScheduleDto {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken,
    };
  }

  private toAssetPath(assetPath: string): string {
    return `/${path.posix.basename(assetPath)}`;
  }
}
