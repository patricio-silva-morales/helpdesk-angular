import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstadoTicket } from './estado-ticket';

describe('EstadoTicket', () => {
  let component: EstadoTicket;
  let fixture: ComponentFixture<EstadoTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadoTicket],
    }).compileComponents();

    fixture = TestBed.createComponent(EstadoTicket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
