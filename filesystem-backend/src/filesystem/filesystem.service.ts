import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { FileEntry } from './interfaces/file-entry.interface';

@Injectable()
export class FilesystemService {

  private CONCURRENCY_LIMIT = 50;

  async readDirectory(dirPath: string): Promise<FileEntry[]> {
    const resolvedPath = path.resolve(dirPath);

    let entries;

    try {
      entries = await fs.readdir(resolvedPath, { withFileTypes: true });
    } catch {
      throw new HttpException(
        { message: 'Unable to read directory' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const results: FileEntry[] = [];

    // process in chunks (controlled concurrency)
    for (let i = 0; i < entries.length; i += this.CONCURRENCY_LIMIT) {
      const batch = entries.slice(i, i + this.CONCURRENCY_LIMIT);

      const batchResults = await Promise.all(
        batch.map(async (entry) => {
          const fullPath = path.join(resolvedPath, entry.name);

          try {
            const stats = await fs.stat(fullPath);

            return {
              name: entry.name,
              fullPath,
              size: stats.isFile() ? stats.size : 0,
              extension: stats.isFile() ? path.extname(entry.name) : null,
              isDirectory: stats.isDirectory(),
              createdAt: stats.birthtime,
              permissions: (stats.mode & 0o777).toString(8),
            };
          } catch {
            return null;
          }
        }),
      );

      results.push(...batchResults.filter(Boolean) as FileEntry[]);
    }

    return results;
  }
}