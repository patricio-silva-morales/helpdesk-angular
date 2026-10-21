import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccionesTicket } from './acciones-ticket';

describe('AccionesTicket', () => {
  let component: AccionesTicket;
  let fixture: ComponentFixture<AccionesTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccionesTicket],
    }).compileComponents();

    fixture = TestBed.createComponent(AccionesTicket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
