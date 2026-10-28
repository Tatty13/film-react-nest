import { Controller, Get, Param } from '@nestjs/common';

import { FilmsService } from './films.service';
import { GetFilmScheduleDto, GetFilmsDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  getFilms(): Promise<GetFilmsDto> {
    return this.filmsService.findAll();
  }

  @Get(':id/schedule')
  getFilmSchedule(@Param('id') id: string): Promise<GetFilmScheduleDto> {
    return this.filmsService.findById(id);
  }
}
