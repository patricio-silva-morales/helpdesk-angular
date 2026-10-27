import { Component, OnInit, inject, signal } from '@angular/core';
import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket';
import { KanbanColumna } from './kanban-columna/kanban-columna';

@Component({
  imports: [KanbanColumna],
  selector: 'app-kanban',
  styleUrl: './kanban.css',
  templateUrl: './kanban.html',
})
export class Kanban implements OnInit{
  private ticketService = inject(TicketService);

  estados = [
    {
      nombre: 'Abierto',
      titulo: 'Abiertos'
    },
    {
      nombre: 'En proceso',
      titulo: 'En proceso'
    },
    {
      nombre: 'Cerrado',
      titulo: 'Cerrados'
    }
  ] as const;

  tickets = signal<Ticket[]>([]);
  cargando = signal(true);
  error = signal(false);

  ngOnInit(): void {
    this.cargarTickets();
  }

  cargarTickets(): void {
    this.cargando.set(true);
    this.error.set(false);

    this.ticketService.obtenerTickets().subscribe({
      next: (tickets) => {
        this.tickets.set(tickets);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error("Error al cargar tickets: ", error)
        this.cargando.set(false);
        this.error.set(true);
      }
    });
  }

  ticketsPorEstado(estado: Ticket['estado']): Ticket[] {
    return this.tickets().filter(ticket => ticket.estado === estado) .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
  }
}
