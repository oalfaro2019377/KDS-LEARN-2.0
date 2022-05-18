import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCoursesByStudentComponent } from './list-courses-by-student.component';

describe('ListCoursesByStudentComponent', () => {
  let component: ListCoursesByStudentComponent;
  let fixture: ComponentFixture<ListCoursesByStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCoursesByStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCoursesByStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
