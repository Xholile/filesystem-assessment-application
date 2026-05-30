// filesystem.controller.ts
import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { FilesystemService } from './filesystem.service';
import { ListDirectoryDto } from './dto/list-directory.dto';

@Controller('filesystem')
export class FilesystemController {
  constructor(private readonly filesystemService: FilesystemService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  getDirectory(@Query() query: ListDirectoryDto) {
    return this.filesystemService.readDirectory(query.path, query.page, query.limit);
  }
}