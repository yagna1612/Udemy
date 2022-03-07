/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuthorizationCheckService } from './authorizationCheck.service';

describe('Service: AuthorizationCheck', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthorizationCheckService]
    });
  });

  it('should ...', inject([AuthorizationCheckService], (service: AuthorizationCheckService) => {
    expect(service).toBeTruthy();
  }));
});
