import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrioridadTicket } from './prioridad-ticket';

describe('PrioridadTicket', () => {
  let component: PrioridadTicket;
  let fixture: ComponentFixture<PrioridadTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrioridadTicket],
    }).compileComponents();

    fixture = TestBed.createComponent(PrioridadTicket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
