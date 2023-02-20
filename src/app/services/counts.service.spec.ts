import { TestBed } from '@angular/core/testing';

import { CountsService } from './counts.service';

describe('CountsService', () => {
  let service: CountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
