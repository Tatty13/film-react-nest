import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import mongoose, { Connection } from 'mongoose';
import { AppConfig } from 'src/app.config.provider';

@Injectable()
export class MongoDBService implements OnModuleInit, OnApplicationShutdown {
  private readonly connection: Connection;

  constructor(@Inject('CONFIG') config: AppConfig) {
    const { driver, url } = config.database;
    if (driver !== 'mongodb') {
      throw new Error(`Неподдерживаемый драйвер базы данных: ${driver}`);
    }

    this.connection = mongoose.createConnection(url);
  }

  async onModuleInit(): Promise<void> {
    await this.connection.asPromise();
  }

  async onApplicationShutdown(): Promise<void> {
    await this.connection.close();
  }

  getConnection(): Connection {
    return this.connection;
  }
}
