import { TestBed } from '@angular/core/testing';

import { RestCommentsService } from './rest-comments.service';

describe('RestCommentsService', () => {
  let service: RestCommentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestCommentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
