import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
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
    MatIcon,
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

  dataSource = new MatTableDataSource<Ticket>();

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
    this.dataSource.filterPredicate = (
      ticket: Ticket,
      filtroJson: string
    ): boolean => {
      const criterios = JSON.parse(filtroJson) as typeof this.filtros;
      const texto = criterios.texto.trim().toLocaleLowerCase();
      
      const coincideTexto = texto === '' || [
        ticket.id,
        ticket.asunto,
        ticket.descripcion,
        ticket.estado,
        ticket.prioridad
      ].some(valor => String(valor).toLocaleLowerCase().includes(texto));
      
      const coincideEstado = criterios.estado === '' || ticket.estado === criterios.estado;
      
      const coincidePrioridad = criterios.prioridad === '' || ticket.prioridad === criterios.prioridad;

      const fechaTicket = ticket.fechaCreacion.slice(0, 10);
      const coincideFechaDesde = criterios.fechaDesde === '' || fechaTicket >= criterios.fechaDesde;
      const coincideFechaHasta = criterios.fechaHasta === '' || fechaTicket <= criterios.fechaHasta;

      return coincideTexto && coincideEstado && coincidePrioridad && coincideFechaDesde && coincideFechaHasta;
    };
  }  

  @ViewChild(MatPaginator)
  set paginator(paginator: MatPaginator) {
    if (paginator) {
      this.dataSource.paginator = paginator;
    }
  }

  ngOnInit(): void {
    this.dataSource.filter = JSON.stringify(this.filtros);
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

  aplicarBusqueda(valor: string): void {
    this.filtros.texto = valor;
    this.aplicarFiltros();
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

    if (this.filtros.fechaDesde !== '' && this.filtros.fechaDesde > this.filtros.fechaHasta) {
      this.filtros.fechaHasta = this.filtros.fechaDesde;
    }

    this.aplicarFiltros();
  }

  aplicarFechaHasta(valor: string): void {
    this.filtros.fechaHasta = valor;

    if (this.filtros.fechaHasta !== '' && this.filtros.fechaHasta < this.filtros.fechaDesde) {
      this.filtros.fechaDesde = this.filtros.fechaHasta;
    }

    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.dataSource.filter = JSON.stringify(this.filtros);
    this.dataSource.paginator?.firstPage();
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

  get sinResultados(): boolean {
    return this.dataSource.filteredData.length === 0;
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
        this.cargarTickets();
      },
      error: (error) => {
        console.error('Error al intentar eliminar el ticket:', error);
        this.eliminandoId.set(null);
      }
    });
  }
}