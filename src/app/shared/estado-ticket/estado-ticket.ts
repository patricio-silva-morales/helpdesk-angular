import { Component, input } from '@angular/core';
import { Ticket } from '../../models/ticket';

@Component({
  imports: [],
  selector: 'app-estado-ticket',
  styleUrl: './estado-ticket.css',
  templateUrl: './estado-ticket.html',
})
export class EstadoTicket {
  estado = input.required<Ticket['estado']>();
}
