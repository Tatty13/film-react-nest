import { Test, TestingModule } from '@nestjs/testing';

import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmDto, ScheduleDto } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: {
    findAll: jest.Mock;
    findById: jest.Mock;
  };

  beforeEach(async () => {
    filmsService = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: filmsService,
        },
      ],
    }).compile();

    controller = module.get(FilmsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getFilms возвращает список фильмов от сервиса', async () => {
    const film: FilmDto = {
      id: 'film-1',
      rating: 8.3,
      director: 'Режиссёр',
      tags: ['Drama'],
      title: 'Супер-фильм',
      about: 'О фильме',
      description: 'Описание фильма',
      image: '/image.jpg',
      cover: '/cover.jpg',
    };
    const response = { total: 1, items: [film] };
    filmsService.findAll.mockResolvedValue(response);

    await expect(controller.getFilms()).resolves.toEqual(response);
    expect(filmsService.findAll).toHaveBeenCalledTimes(1);
  });

  it('getFilmSchedule передает id сервиса и возвращает расписание', async () => {
    const schedule: ScheduleDto = {
      id: 'session-1',
      daytime: '2026-11-26T18:00:00.000Z',
      hall: 1,
      rows: 2,
      seats: 3,
      price: 500,
      taken: [],
    };
    const response = { total: 1, items: [schedule] };
    filmsService.findById.mockResolvedValue(response);

    await expect(controller.getFilmSchedule('film-1')).resolves.toEqual(
      response,
    );
    expect(filmsService.findById).toHaveBeenCalledWith('film-1');
  });

  it('getFilms передает ошибку сервиса вызывающему коду', async () => {
    const error = new Error('Repository unavailable');
    filmsService.findAll.mockRejectedValue(error);

    await expect(controller.getFilms()).rejects.toBe(error);
  });
});
