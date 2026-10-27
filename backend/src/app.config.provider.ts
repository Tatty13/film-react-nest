import 'dotenv/config';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

export const configProvider = {
  provide: 'CONFIG',
  useValue: <AppConfig>{
    database: {
      driver: process.env.DATABASE_DRIVER,
      url: process.env.DATABASE_URL,
    },
    port: Number(process.env.PORT) || 3000,
  },
};

export interface AppConfig {
  database: AppConfigDatabase;
  port: number;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}

@Global()
@Module({
  imports: [ConfigModule],
  providers: [configProvider],
  exports: ['CONFIG'],
})
export class AppConfigModule {}
