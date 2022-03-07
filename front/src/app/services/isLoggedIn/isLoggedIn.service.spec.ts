/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { IsLoggedInService } from './isLoggedIn.service';

describe('Service: IsLoggedIn', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsLoggedInService]
    });
  });

  it('should ...', inject([IsLoggedInService], (service: IsLoggedInService) => {
    expect(service).toBeTruthy();
  }));
});
