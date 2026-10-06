import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-tickets',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    DatePipe
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
    'fechaCreacion'
  ];

  dataSource = new MatTableDataSource<Ticket>();

  cargando = signal(true);
  error = signal(false);

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
}