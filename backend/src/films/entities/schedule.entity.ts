import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Film } from './film.entity';

@Entity({ name: 'schedules', schema: 'public' })
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  @IsOptional()
  @IsUUID()
  id: string;

  @Column()
  @IsDateString()
  daytime: string;

  @Column('integer')
  @IsInt()
  @Min(0)
  hall: number;

  @Column('integer')
  @IsInt()
  @Min(1)
  rows: number;

  @Column('integer')
  @IsInt()
  @Min(1)
  seats: number;

  @Column('double precision')
  @IsNumber()
  @Min(0)
  price: number;

  @Column('text', { array: true })
  @IsArray()
  @IsString({ each: true })
  taken: string[];

  @ManyToOne(() => Film, (film) => film.schedule)
  @JoinColumn({ name: 'filmId' })
  film: Film;
}
