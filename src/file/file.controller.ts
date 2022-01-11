import {
  Controller,
  Get,
  Post,
  Query,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/auth/jwt-auth.guard';
import {
  GetFileInputDto,
  UploadFileOutputDto,
  UploadFileRequestDto,
} from './dto/file.dto';
import { FileService } from './file.service';

@Controller('file')
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

  @Post('upload')
  @ApiResponse({ type: UploadFileOutputDto })
  @UseInterceptors(FileInterceptor('displayPicture'))
  @UseGuards(JwtAuthGuard)
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: UploadFileRequestDto,
  ): Promise<UploadFileOutputDto> {
    return this.fileService.uploadFile(file, req);
  }
}
