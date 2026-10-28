import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { ResponseListDto } from 'src/common/dto/response.dto';

export class FilmDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  rating: number;

  @IsString()
  @IsNotEmpty()
  director: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  about: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  cover: string;
}

export class ScheduleDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsDateString()
  daytime: string; // UTC

  @IsInt()
  @Min(0)
  hall: number;

  @IsInt()
  @Min(1)
  rows: number;

  @IsInt()
  @Min(1)
  seats: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsArray()
  @IsString({ each: true })
  taken: string[];
}

export class FilmWithScheduleDto extends FilmDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  schedule: ScheduleDto[];
}

export class GetFilmsDto extends ResponseListDto<FilmDto> {}
export class GetFilmScheduleDto extends ResponseListDto<ScheduleDto> {}
