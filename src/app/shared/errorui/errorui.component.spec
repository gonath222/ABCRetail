import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErroruiComponent } from './errorui.component';

describe('ErroruiComponent', () => {
  let component: ErroruiComponent;
  let fixture: ComponentFixture<ErroruiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErroruiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErroruiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
