import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  getRoot() {
    return {
      message: 'Filesystem API is running',
      endpoint: '/filesystem?path=/host'
    };
  }
}