import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { Ticket } from '../../models/ticket';

@Component({
  imports: [MatCardModule, DatePipe, FormsModule],
  selector: 'app-tarjeta-ticket',
  styleUrl: './tarjeta-ticket.css',
  templateUrl: './tarjeta-ticket.html',
})
export class TarjetaTicket {
  ticket = input.required<Ticket>();

  cambiarEstado = output<{
    ticket: Ticket;
    nuevoEstado: Ticket['estado'];
  }>();

  estados: Ticket['estado'][] = [
    'Abierto',
    'En proceso',
    'Cerrado'
  ];

  seleccionEstado(nuevoEstado: Ticket['estado']):void {
    if (nuevoEstado === this.ticket().estado) {
      return;
    }

    this.cambiarEstado.emit({
      ticket: this.ticket(),
      nuevoEstado
    });
  }
}
