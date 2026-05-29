import { Controller, Get, Query } from '@nestjs/common';
import { FilesystemService } from './filesystem.service';
import { ListDirectoryDto } from './dto/list-directory.dto';

@Controller('filesystem')
export class FilesystemController {

    constructor(private readonly filesystemService: FilesystemService) {}

    @Get()
    async listDirectory(@Query() query: ListDirectoryDto) {
    return this.filesystemService.readDirectory(query.path);
    }
}
