import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchtransactionsComponent } from './searchtransactions.component';

describe('SearchtransactionsComponent', () => {
  let component: SearchtransactionsComponent;
  let fixture: ComponentFixture<SearchtransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchtransactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchtransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
