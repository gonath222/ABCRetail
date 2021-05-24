import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferfundsComponent } from './transferfunds.component';

describe('TransferfundsComponent', () => {
  let component: TransferfundsComponent;
  let fixture: ComponentFixture<TransferfundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferfundsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferfundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
