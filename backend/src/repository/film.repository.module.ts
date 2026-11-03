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
        type: configService.getOrThrow<'postgres'>('DATABASE_DRIVER'),
        host: configService.getOrThrow<string>('DATABASE_HOST'),
        port: Number(configService.getOrThrow<string>('DATABASE_PORT')),
        database: configService.getOrThrow<string>('DATABASE_NAME'),
        username: configService.getOrThrow<string>('DATABASE_USERNAME'),
        password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
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
