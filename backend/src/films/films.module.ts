import { Module } from '@nestjs/common';

import { FilmRepositoryModule } from 'src/repository/film/film.repository.module';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

@Module({
  imports: [FilmRepositoryModule],
  controllers: [FilmsController],
  providers: [FilmsService],
})
export class FilmsModule {}
