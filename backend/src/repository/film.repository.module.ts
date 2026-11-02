import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Film } from 'src/films/entities/film.entity';
import { Schedule } from 'src/films/entities/schedule.entity';

import { FilmPostgresRepository } from './postgres/film.postgres.repository';
import { FILMS_REPOSITORY } from './films.repository';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.getOrThrow<'postgres'>('database.driver'),
        url: configService.getOrThrow<string>('database.url'),
        username: configService.getOrThrow<string>('database.username'),
        password: configService.getOrThrow<string>('database.password'),
        entities: [Film, Schedule],
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  providers: [
    FilmPostgresRepository,
    {
      provide: FILMS_REPOSITORY,
      useExisting: FilmPostgresRepository,
    },
  ],
  exports: [FILMS_REPOSITORY],
})
export class FilmRepositoryModule {}
