import { Module } from '@nestjs/common';

import { DatabaseModule, DBMS } from 'src/database/database.module';
import { MongoDBService } from 'src/database/mongodb.service';
import { FilmsMongoDbRepository } from './films.mongodb.repository';
import { FILMS_REPOSITORY } from './films.repository';

@Module({
  imports: [DatabaseModule.register(DBMS.MongoDB)],
  providers: [
    {
      provide: FILMS_REPOSITORY,
      useFactory: (mongo: MongoDBService) =>
        new FilmsMongoDbRepository(mongo.getConnection()),
      inject: [MongoDBService],
    },
  ],
  exports: [FILMS_REPOSITORY],
})
export class FilmRepositoryModule {}
