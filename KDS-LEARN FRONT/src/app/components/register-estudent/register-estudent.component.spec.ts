import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterEstudentComponent } from './register-estudent.component';

describe('RegisterEstudentComponent', () => {
  let component: RegisterEstudentComponent;
  let fixture: ComponentFixture<RegisterEstudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterEstudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterEstudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
