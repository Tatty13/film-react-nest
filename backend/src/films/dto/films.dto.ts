import { ResponseListDto } from 'src/common/dto/response.dto';

export class FilmDto {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  title: string;
  about: string;
  description: string;
  image: string;
  cover: string;
}

export class ScheduleDto {
  id: string;
  daytime: string; // UTC
  hall: string;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export class FilmWithScheduleDto extends FilmDto {
  schedule: ScheduleDto[];
}

export class GetFilmsDto extends ResponseListDto<FilmDto> {}
export class GetFilmScheduleDto extends ResponseListDto<ScheduleDto> {}
