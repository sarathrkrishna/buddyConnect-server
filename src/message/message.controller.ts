import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('message')
@ApiTags('Message-APIs')
export class MessageController {}
