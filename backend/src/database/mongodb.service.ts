import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose, { Connection } from 'mongoose';

@Injectable()
export class MongoDBService implements OnModuleInit, OnApplicationShutdown {
  private readonly connection: Connection;

  constructor(configService: ConfigService) {
    const driver = configService.getOrThrow<string>('database.driver');
    const url = configService.getOrThrow<string>('database.url');
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
