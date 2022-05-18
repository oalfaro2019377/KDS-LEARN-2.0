import { TestBed } from '@angular/core/testing';

import { RestCourseService } from './rest-course.service';

describe('RestCourseService', () => {
  let service: RestCourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestCourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
