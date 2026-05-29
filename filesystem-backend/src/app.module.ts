import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesystemModule } from './filesystem/filesystem.module';

@Module({
  imports: [FilesystemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
