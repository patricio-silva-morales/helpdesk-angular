import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TarjetaTicket } from './tarjeta-ticket';

describe('TarjetaTicket', () => {
  let component: TarjetaTicket;
  let fixture: ComponentFixture<TarjetaTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaTicket],
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetaTicket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
