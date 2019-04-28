import { TestBed } from '@angular/core/testing';

import { FMCService } from './fmc.service';

describe('FMCService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FMCService = TestBed.get(FMCService);
    expect(service).toBeTruthy();
  });
});
