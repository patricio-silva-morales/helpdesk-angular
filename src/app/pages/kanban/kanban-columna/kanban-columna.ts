import { Component, input } from '@angular/core';
import { Ticket } from '../../../models/ticket';
import { TarjetaTicket } from '../../tarjeta-ticket/tarjeta-ticket';

@Component({
  imports: [TarjetaTicket],
  selector: 'app-kanban-columna',
  styleUrl: './kanban-columna.css',
  templateUrl: './kanban-columna.html',
})
export class KanbanColumna {
  titulo = input.required<string>();
  estado = input.required<Ticket['estado']>();
  tickets = input.required<Ticket[]>();
}
