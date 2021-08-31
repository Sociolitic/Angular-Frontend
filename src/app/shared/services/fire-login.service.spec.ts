import { TestBed } from '@angular/core/testing';

import { FireLoginService } from './fire-login.service';

describe('FireLoginService', () => {
  let service: FireLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
