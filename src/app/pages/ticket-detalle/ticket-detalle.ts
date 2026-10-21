import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket';
import { EstadoTicket } from '../../shared/estado-ticket/estado-ticket';
import { PrioridadTicket } from '../../shared/prioridad-ticket/prioridad-ticket';

@Component({
  selector: 'app-ticket-detalle',
  imports: [DatePipe, RouterLink, MatButtonModule, MatIconModule, EstadoTicket, PrioridadTicket],
  templateUrl: './ticket-detalle.html',
  styleUrl: './ticket-detalle.css'
})
export class TicketDetalle implements OnInit {

  private route = inject(ActivatedRoute);
  private ticketService = inject(TicketService);

  ticket = signal<Ticket | null>(null);
  cargando = signal(true);
  error = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id === null) {
      this.error.set(true);
      this.cargando.set(false);
      return;
    }

    this.cargarTicket(id);
  }

  cargarTicket(id: string): void {
    this.cargando.set(true);
    this.error.set(false);

    this.ticketService.obtenerTicket(id).subscribe({
      next: (ticket) => {
        this.ticket.set(ticket);
        this.cargando.set(false);
      },

      error: (error) => {
        console.error('Error al cargar el ticket:', error);
        this.error.set(true);
        this.cargando.set(false);
      }
    });
  }
}