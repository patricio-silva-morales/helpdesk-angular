import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket';

@Component({
  imports: [
    MatCardModule
  ],
  selector: 'app-tickets',
  styleUrl: './tickets.css',
  templateUrl: './tickets.html',
})
export class Tickets implements OnInit {
  private ticketService = inject(TicketService);

  tickets: Ticket[] = [];

  cargando = true;

  ngOnInit(): void {
    this.cargarTickets();  
  }

  cargarTickets(): void {
    this.ticketService.obtenerTickets().subscribe({
      next: (datos) => {
        this.tickets = datos;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al obtener los tickets');
        this.cargando = false;
      }
    });
  }
}
