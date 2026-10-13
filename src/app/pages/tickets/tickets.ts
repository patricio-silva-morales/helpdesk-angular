import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-tickets',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
    RouterLink,
    MatIconModule,
    MatIcon
],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css'
})
export class Tickets implements OnInit {

  private ticketService = inject(TicketService);

  columnas: string[] = [
    'id',
    'asunto',
    'estado',
    'prioridad',
    'fechaCreacion',
    'acciones'
  ];

  dataSource = new MatTableDataSource<Ticket>();

  cargando = signal(true);
  error = signal(false);
  eliminandoId = signal<string | null>(null);

  @ViewChild(MatPaginator)
  set paginator(paginator: MatPaginator) {
    if (paginator) {
      this.dataSource.paginator = paginator;
    }
  }

  ngOnInit(): void {
    this.cargarTickets();
  }

  cargarTickets(): void {
    this.cargando.set(true);
    this.error.set(false);

    this.ticketService.obtenerTickets().subscribe({
      next: (tickets) => {
        this.dataSource.data = tickets;
        this.cargando.set(false);
      },

      error: (error) => {
        console.error('Error al cargar tickets:', error);
        this.error.set(true);
        this.cargando.set(false);
      }
    });
  }

  eliminar(ticket: Ticket): void {
    const confirmado = confirm(`¿Está seguro de eliminar el ticket ${ticket.asunto}?`);

    if (!confirmado) {
      return;
    }

    this.eliminandoId.set(ticket.id);

    this.ticketService.eliminarTicket(ticket.id).subscribe({
      next: () => {
        this.eliminandoId.set(null);
        this.cargarTickets();
      },
      error: (error) => {
        console.error('Error al intentar eliminar el ticket:', error);
        this.eliminandoId.set(null);
      }
    });    
  }
}