import { Test, TestingModule } from '@nestjs/testing';
import { FilesystemController } from './filesystem.controller';
import { FilesystemService } from './filesystem.service';

describe('FilesystemController', () => {
  let controller: FilesystemController;

  const mockFilesystemService = {
    readDirectory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesystemController],
      providers: [
        {
          provide: FilesystemService,
          useValue: mockFilesystemService,
        },
      ],
    }).compile();

    controller = module.get(FilesystemController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should call service with correct path', async () => {
    mockFilesystemService.readDirectory.mockResolvedValue({ data: [] });

    await controller.getDirectory({ path: '/host' } as any);

    expect(mockFilesystemService.readDirectory).toHaveBeenCalledWith(
      '/host',
      undefined,
      undefined,
    );
  });

  it('should return service result', async () => {
    mockFilesystemService.readDirectory.mockResolvedValue({ data: ['test'] });

    const result = await controller.getDirectory({ path: '/host' } as any);

    expect(result).toEqual({ data: ['test'] });
  });
});