import * as path from 'node:path';
import { Connection, Model } from 'mongoose';

import {
  FilmDto,
  FilmWithScheduleDto,
  ScheduleDto,
} from 'src/films/dto/films.dto';
import { toSeatKey } from 'src/common/utils/seat-key.util';
import { FilmEntity, FilmSchema } from './films.mongodb.schema';
import { FilmsRepository, ReserveSeatParams } from './films.repository';

export class FilmsMongoDbRepository implements FilmsRepository {
  private readonly filmModel: Model<FilmEntity>;

  constructor(connection: Connection) {
    this.filmModel = connection.model<FilmEntity>('Film', FilmSchema);
  }

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmModel.find({}, { schedule: 0 }).lean().exec();
    return films.map((film) => this.toFilmDto(film));
  }

  async findById(id: string): Promise<FilmWithScheduleDto | null> {
    const film = await this.filmModel.findOne({ id }).lean().exec();
    if (!film) {
      return null;
    }

    return {
      ...this.toFilmDto(film),
      schedule: film.schedule.map((session) => this.toScheduleDto(session)),
    };
  }

  async reserveSeat({
    filmId,
    sessionId,
    row,
    seat,
  }: ReserveSeatParams): Promise<boolean> {
    const seatKey = toSeatKey(row, seat);
    const result = await this.filmModel
      .updateOne(
        {
          id: filmId,
          schedule: {
            $elemMatch: {
              id: sessionId,
              rows: { $gte: row },
              seats: { $gte: seat },
              taken: { $ne: seatKey },
            },
          },
        },
        { $addToSet: { 'schedule.$.taken': seatKey } },
      )
      .exec();

    return result.modifiedCount === 1;
  }

  private toFilmDto(film: FilmEntity): FilmDto {
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

  private toScheduleDto(session: FilmEntity['schedule'][number]): ScheduleDto {
    return {
      id: session.id,
      daytime: session.daytime,
      hall: String(session.hall),
      rows: session.rows,
      seats: session.seats,
      price: session.price,
      taken: session.taken,
    };
  }

  private toAssetPath(assetPath: string): string {
    return `/${path.posix.basename(assetPath)}`;
  }
}
