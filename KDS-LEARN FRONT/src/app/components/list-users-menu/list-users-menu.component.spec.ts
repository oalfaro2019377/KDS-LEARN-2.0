import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUsersMenuComponent } from './list-users-menu.component';

describe('ListUsersMenuComponent', () => {
  let component: ListUsersMenuComponent;
  let fixture: ComponentFixture<ListUsersMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListUsersMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUsersMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
