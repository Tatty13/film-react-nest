import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import {
  FILMS_REPOSITORY,
  FilmsRepository,
} from 'src/repository/film/films.repository';
import { GetFilmScheduleDto, GetFilmsDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: FilmsRepository,
  ) {}

  async findAll(): Promise<GetFilmsDto> {
    const films = await this.filmsRepository.findAll();
    return {
      total: films?.length,
      items: films,
    };
  }

  async findById(id: string): Promise<GetFilmScheduleDto> {
    const film = await this.filmsRepository.findById(id);

    if (!film) {
      throw new NotFoundException(`Не удалось найти фильм по id ${id}`);
    }

    return { total: film.schedule.length, items: film.schedule };
  }
}
