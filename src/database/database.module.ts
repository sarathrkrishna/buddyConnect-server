import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { Pool } from 'pg';

import { DatabaseService } from './database.service';

// create database pool factory method
const databasePoolFactory = async (configService: ConfigService) => {
  return new Pool({
    user: configService.get('db.user'),
    host: configService.get('db.host'),
    database: configService.get('db.database'),
    password: configService.get('db.password'),
    port: configService.get('db.port'),
  });
};

@Module({
  imports: [],
  exports: [DatabaseService],
  providers: [
    {
      provide: 'DATABASE_POOL',
      inject: [ConfigService],
      useFactory: databasePoolFactory,
    },
    DatabaseService,
  ],
})
export class DatabaseModule {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(private readonly moduleRef: ModuleRef) {}

  onApplicationShutdown(signal?: string): any {
    this.logger.log(`Shutting down on signal ${signal}`);
    const pool = this.moduleRef.get('DATABASE_POOL') as Pool;
    return pool.end();
  }
}
