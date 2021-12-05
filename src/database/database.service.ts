import { Inject, Injectable, Logger } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async rawQuery(query: string, params: any[] = []): Promise<any[]> {
    // log query and params
    this.logger.log(`Executing query: ${query} <= ${params}`);

    const result = await this.pool.query(query, params);

    // log query output
    this.logger.log(`Executed Query, rows fetched: ${result.rows.length}`);

    return result.rows;
  }
}
