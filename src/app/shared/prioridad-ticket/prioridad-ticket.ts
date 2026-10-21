import { Component, input } from '@angular/core';
import { Ticket } from '../../models/ticket';

@Component({
  imports: [],
  selector: 'app-prioridad-ticket',
  styleUrl: './prioridad-ticket.css',
  templateUrl: './prioridad-ticket.html',
})
export class PrioridadTicket {
  prioridad = input.required<Ticket['prioridad']>();
}
