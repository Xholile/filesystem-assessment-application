import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { FilesystemService } from './filesystem';


describe('FilesystemService', () => {
  let service: FilesystemService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FilesystemService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(FilesystemService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call API with correct query params', () => {
    service.getDirectory('/host', 2, 25).subscribe();

    const req = httpMock.expectOne((r) =>
      r.url === 'http://localhost:3000/filesystem' &&
      r.params.get('path') === '/host' &&
      r.params.get('page') === '2' &&
      r.params.get('limit') === '25'
    );

    expect(req.request.method).toBe('GET');

    req.flush({
      data: [],
      total: 0,
      page: 2,
      limit: 25,
      totalPages: 0,
    });
  });
});