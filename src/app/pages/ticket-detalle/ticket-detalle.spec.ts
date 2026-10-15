import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketDetalle } from './ticket-detalle';

describe('TicketDetalle', () => {
  let component: TicketDetalle;
  let fixture: ComponentFixture<TicketDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
