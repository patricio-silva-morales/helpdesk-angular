import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraficoTickets } from './grafico-tickets';

describe('GraficoTickets', () => {
  let component: GraficoTickets;
  let fixture: ComponentFixture<GraficoTickets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoTickets],
    }).compileComponents();

    fixture = TestBed.createComponent(GraficoTickets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
