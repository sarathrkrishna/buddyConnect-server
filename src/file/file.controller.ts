import { Controller, Get, Param, Query, Response } from '@nestjs/common';
import { GetFileInputDto } from './dto/file.dto';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  getFile(
    @Query() urlParam: GetFileInputDto,
    @Response({ passthrough: true }) res,
  ) {
    return this.fileService.getFile(urlParam, res);
  }
}
