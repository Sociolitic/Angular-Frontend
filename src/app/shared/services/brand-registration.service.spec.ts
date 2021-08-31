import { TestBed } from '@angular/core/testing';

import { BrandRegistrationService } from './brand-registration.service';

describe('BrandRegistrationService', () => {
  let service: BrandRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrandRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
