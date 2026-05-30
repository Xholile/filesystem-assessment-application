import { TestBed } from '@angular/core/testing';

import { Filesystem } from './filesystem';

describe('Filesystem', () => {
  let service: Filesystem;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Filesystem);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
