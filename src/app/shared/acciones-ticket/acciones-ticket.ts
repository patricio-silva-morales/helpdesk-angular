import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Ticket } from '../../models/ticket';

@Component({
  imports: [RouterLink, MatButtonModule, MatIconModule],
  selector: 'app-acciones-ticket',
  styleUrl: './acciones-ticket.css',
  templateUrl: './acciones-ticket.html',
})
export class AccionesTicket {
  ticket = input.required<Ticket>();
  eliminando = input(false);

  eliminar = output<Ticket>();

  solicitarEliminacion(): void {
    this.eliminar.emit(this.ticket());
  }

}
