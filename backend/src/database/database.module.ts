import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MongoDBService } from './mongodb.service';

export enum DBMS {
  MongoDB,
}

@Module({})
export class DatabaseModule {
  static register(dbms: DBMS): DynamicModule {
    const providers = [];

    switch (dbms) {
      case DBMS.MongoDB:
      default:
        providers.push(MongoDBService);
        break;
    }

    return {
      module: DatabaseModule,
      imports: [ConfigModule],
      providers,
      exports: providers,
    };
  }
}
