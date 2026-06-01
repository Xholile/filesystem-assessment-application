import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FilesystemModule } from './filesystem/filesystem.module';

@Module({
  imports: [FilesystemModule],
  controllers: [AppController],
})
export class AppModule {}
