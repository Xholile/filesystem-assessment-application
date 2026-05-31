import { FilesystemService } from './filesystem.service';
import * as fs from 'fs/promises';

jest.mock('fs/promises');

describe('FilesystemService', () => {
  let service: FilesystemService;

  const mockedFs = fs as jest.Mocked<typeof fs>;

  beforeEach(() => {
    service = new FilesystemService();
    jest.clearAllMocks();
  });

  const dirent = (name: string, isDir: boolean) => ({
    name,
    isDirectory: () => isDir,
  });

  it('should read directory and return paginated result', async () => {
    mockedFs.readdir.mockResolvedValue([dirent('folder', true)] as any);

    mockedFs.stat.mockResolvedValue({
      isFile: () => false,
      isDirectory: () => true,
      size: 0,
      birthtime: new Date(),
      mode: 16877,
    } as any);

    const result = await service.readDirectory('/host');

    expect(result.data.length).toBe(1);
    expect(result.total).toBe(1);
  });

  it('should correctly identify directories vs files', async () => {
    mockedFs.readdir.mockResolvedValue([dirent('folder', true)] as any);

    mockedFs.stat.mockResolvedValue({
      isFile: () => false,
      isDirectory: () => true,
      size: 0,
      birthtime: new Date(),
      mode: 16877,
    } as any);

    const result = await service.readDirectory('/host');

    expect(result.data[0].isDirectory).toBe(true);
  });

  it('should map file metadata correctly', async () => {
    mockedFs.readdir.mockResolvedValue([dirent('test.txt', false)] as any);

    mockedFs.stat.mockResolvedValue({
      isFile: () => true,
      isDirectory: () => false,
      size: 1234,
      birthtime: new Date('2024-01-01'),
      mode: 33188,
    } as any);

    const result = await service.readDirectory('/host');

    expect(result.data[0]).toEqual(
      expect.objectContaining({
        name: 'test.txt',
        size: 1234,
        isDirectory: false,
      }),
    );
  });
});