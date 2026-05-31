import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { FileEntry } from './interfaces/file-entry.interface';

export interface PaginatedResult {
  data: FileEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class FilesystemService {

  private CONCURRENCY_LIMIT = 50;

  async readDirectory(
    dirPath: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<PaginatedResult> {

    if (!dirPath.startsWith('/host')) {
      throw new Error('Invalid path. Must be inside mounted volume.');
    }

    const resolvedPath = path.resolve(dirPath);

    let entries;
    try {
       entries = await fs.readdir(resolvedPath, {
        withFileTypes: true,
        } as any);
            } catch (error: any) {
            throw new Error(
                `Unable to read directory: ${resolvedPath} - ${error.message}`,
            );
        }
    const total = entries.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const pageEntries = entries.slice(start, start + limit);

    const results: FileEntry[] = [];

    for (let i = 0; i < pageEntries.length; i += this.CONCURRENCY_LIMIT) {
      const batch = pageEntries.slice(i, i + this.CONCURRENCY_LIMIT);

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
              permissions: (stats as any).mode
                ? ((stats as any).mode & 0o777).toString(8)
                : '755',
            };
          } catch {
            return null;
          }
        }),
      );

      results.push(...batchResults.filter(Boolean) as FileEntry[]);
    }

    return {
      data: results,
      total,
      page,
      limit,
      totalPages,
    };
  }
}