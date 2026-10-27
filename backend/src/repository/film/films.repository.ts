import { FilmDto, FilmWithScheduleDto } from 'src/films/dto/films.dto';

export interface ReserveSeatParams {
  filmId: string;
  sessionId: string;
  row: number;
  seat: number;
}

export interface FilmsRepository {
  findAll(): Promise<FilmDto[]>;
  findById(id: string): Promise<FilmWithScheduleDto | null>;
  reserveSeat(params: ReserveSeatParams): Promise<boolean>;
}

export const FILMS_REPOSITORY = 'FILMS_REPOSITORY';
