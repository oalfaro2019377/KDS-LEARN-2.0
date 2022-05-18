import { TestBed } from '@angular/core/testing';

import { UploadUserService } from './upload-user.service';

describe('UploadUserService', () => {
  let service: UploadUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
