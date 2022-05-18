import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCoursesByTeacherComponent } from './list-courses-by-teacher.component';

describe('ListCoursesByTeacherComponent', () => {
  let component: ListCoursesByTeacherComponent;
  let fixture: ComponentFixture<ListCoursesByTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCoursesByTeacherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCoursesByTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
