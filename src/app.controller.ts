import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Controller('test')
export class AppController {
  constructor(readonly dataService: DatabaseService) {}

  @Get('get')
  get() {
    return this.dataService.rawQuery(`SELECT * FROM client_master`, []);
  }
}
