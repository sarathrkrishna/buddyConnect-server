import { Controller, Get, Query, Response, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/auth/jwt-auth.guard';
import { GetFileInputDto } from './dto/file.dto';
import { FileService } from './file.service';

@Controller('file')
@ApiTags('File-Apis')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  @ApiQuery({ type: GetFileInputDto })
  @UseGuards(JwtAuthGuard)
  getFile(
    @Query() urlParam: GetFileInputDto,
    @Response({ passthrough: true }) res,
  ) {
    return this.fileService.getFile(urlParam, res);
  }
}
