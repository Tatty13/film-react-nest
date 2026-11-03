import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Schedule } from './schedule.entity';

@Entity({ name: 'films', schema: 'public' })
export class Film {
  @PrimaryGeneratedColumn('uuid')
  @IsOptional()
  @IsUUID()
  id: string;

  @Column('double precision')
  @IsNumber()
  rating: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  director: string;

  @Column('text', { array: true })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @Column()
  @IsString()
  @IsNotEmpty()
  image: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  cover: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  about: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  description: string;

  @OneToMany(() => Schedule, (schedule) => schedule.film)
  schedule: Schedule[];
}
