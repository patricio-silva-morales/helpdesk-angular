import { Component, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, of, switchMap, timer } from 'rxjs';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket';
import { RouterLink } from '@angular/router';
import { EstadoTicket } from '../../shared/estado-ticket/estado-ticket';
import { PrioridadTicket } from '../../shared/prioridad-ticket/prioridad-ticket';
import { AccionesTicket } from '../../shared/acciones-ticket/acciones-ticket';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-tickets',
  imports: [
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    DatePipe,
    RouterLink,
    MatIconModule,
    EstadoTicket,
    PrioridadTicket,
    AccionesTicket
  ],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css'
})
export class Tickets implements OnInit {

  private ticketService = inject(TicketService);
  private dialog = inject(MatDialog);

  columnas: string[] = [
    'id',
    'asunto',
    'estado',
    'prioridad',
    'fechaCreacion',
    'acciones'
  ];

  // MODIFICADO: conserva la última página confirmada.
  readonly filas = signal<Ticket[]>([]);
  readonly total = signal(0);
  readonly paginaVisible = signal(0);
  readonly tamanoVisible = signal(20);
  readonly paginaCargada = signal(false);

  indiceSolicitado = 0;
  tamanoSolicitado = 20;
  private readonly recargas = new Subject<number>();

  cargando = signal(true);
  error = signal(false);
  eliminandoId = signal<string | null>(null);

  filtros = {
    texto: '',
    estado: '',
    prioridad: '',
    fechaDesde: '',
    fechaHasta: ''
  };

  constructor() {
    this.recargas.pipe(
      switchMap(demora =>
        (demora > 0 ? timer(demora) : of(0)).pipe(
          switchMap(() => this.ticketService.obtenerTicketsPaginados(
            this.indiceSolicitado + 1,
            this.tamanoSolicitado,
            this.filtros
          )),
          catchError(error => {
            console.error('Error al cargar tickets:', error);
            return of(null);
          })
        )
      ),
      takeUntilDestroyed()
    ).subscribe(pagina => {
      if (pagina) {
        this.filas.set(pagina.results);
        this.total.set(pagina.count);
        this.paginaVisible.set(this.indiceSolicitado);
        this.tamanoVisible.set(this.tamanoSolicitado);
        this.paginaCargada.set(true);
      } else {
        this.error.set(true);
      }

      this.cargando.set(false);
    });
  }

  ngOnInit(): void {
    this.cargarTickets();
  }

  cargarTickets(demora = 0): void {
    this.cargando.set(true);
    this.error.set(false);
    this.recargas.next(demora);
  }

  cambiarPagina(evento: PageEvent): void {
    this.indiceSolicitado = evento.pageIndex;
    this.tamanoSolicitado = evento.pageSize;
    this.cargarTickets();
  }

  aplicarBusqueda(valor: string): void {
    this.filtros.texto = valor;
    this.aplicarFiltros(300);
  }

  aplicarFiltroEstado(valor: string): void {
    this.filtros.estado = valor;
    this.aplicarFiltros();
  }

  aplicarFiltroPrioridad(valor: string): void {
    this.filtros.prioridad = valor;
    this.aplicarFiltros();
  }

  aplicarFechaDesde(valor: string): void {
    this.filtros.fechaDesde = valor;

    if (valor && this.filtros.fechaHasta && valor > this.filtros.fechaHasta) {
      this.filtros.fechaHasta = this.filtros.fechaDesde;
    }

    this.aplicarFiltros();
  }

  aplicarFechaHasta(valor: string): void {
    this.filtros.fechaHasta = valor;

    if (valor && this.filtros.fechaDesde && valor < this.filtros.fechaDesde) {
      this.filtros.fechaDesde = this.filtros.fechaHasta;
    }

    this.aplicarFiltros();
  }

  private aplicarFiltros(demora = 0): void {
    this.indiceSolicitado = 0;
    this.cargarTickets(demora);
  }

  limpiarFiltros(): void {
    this.filtros = {
      texto: '',
      estado: '',
      prioridad: '',
      fechaDesde: '',
      fechaHasta: ''
    }

    this.aplicarFiltros();
  }

  eliminar(ticket: Ticket): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '430px',
      maxWidth: '95vw',
      disableClose: true,
      data: {
        titulo: 'Eliminar ticket',
        mensaje: '¿Está seguro que desea eliminar el ticket?',
        textoConfirmar: 'Eliminar',
        textoCancelar: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(
      resultado => {
        if (resultado !== true) {
          return;
        }

        this.eliminarTicket(ticket);
    });
  }

  private eliminarTicket(ticket: Ticket): void {
    this.eliminandoId.set(ticket.id);

    this.ticketService.eliminarTicket(ticket.id).subscribe({
      next: () => {
        this.eliminandoId.set(null);
        this.aplicarFiltros();
      },
      error: (error) => {
        console.error('Error al intentar eliminar el ticket:', error);
        this.eliminandoId.set(null);
      }
    });
  }
}
