import { Component, input, output } from '@angular/core';
import { Ticket } from '../../../models/ticket';
import { TarjetaTicket } from '../../tarjeta-ticket/tarjeta-ticket';
import {
  CdkDrag,
  CdkDropList,
  CdkDragDrop
} from '@angular/cdk/drag-drop';

@Component({
  imports: [TarjetaTicket, CdkDrag, CdkDropList],
  selector: 'app-kanban-columna',
  styleUrl: './kanban-columna.css',
  templateUrl: './kanban-columna.html',
})
export class KanbanColumna {
  titulo = input.required<string>();
  estado = input.required<Ticket['estado']>();
  tickets = input.required<Ticket[]>();

  cambiarEstado = output<{
    ticket: Ticket;
    nuevoEstado: Ticket['estado'];
  }>();

  moverTicket = output<{
    ticket: Ticket;
    estadoDestino: Ticket['estado'];
  }>();

  soltarTicket(evento: CdkDragDrop<Ticket[]>): void {
    const ticket = evento.item.data as Ticket;

    if (ticket.estado === this.estado()) {
      return;
    }

    this.moverTicket.emit({
      ticket,
      estadoDestino: this.estado()
    });
  }
}