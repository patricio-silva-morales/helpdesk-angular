import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket';
import { TarjetaIndicador } from '../../shared/tarjeta-indicador/tarjeta-indicador';

type FiltroPrioridad = Ticket['prioridad'] | 'Todas';

interface ResumenTickets {
  total: number;
  abiertos: number;
  enProceso: number;
  cerrados: number;
  altaPendientes: number;
}

@Component({
  selector: 'app-dashboard',

  imports: [
    DecimalPipe,
    FormsModule,
    MatButtonModule,
    TarjetaIndicador
  ],

  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private readonly ticketService = inject(TicketService);
  private readonly destroyRef = inject(DestroyRef);

  readonly tickets = signal<Ticket[]>([]);
  readonly cargando = signal(false);
  readonly errorCarga = signal('');

  readonly prioridadSeleccionada = signal<FiltroPrioridad>('Todas');

  readonly opcionesPrioridad: FiltroPrioridad[] = [
    'Todas',
    'Baja',
    'Media',
    'Alta'
  ];

  readonly ticketsFiltrados = computed(() => {
    const prioridad = this.prioridadSeleccionada();
    const tickets = this.tickets();

    return prioridad === 'Todas'
      ? tickets
      : tickets.filter(ticket => ticket.prioridad === prioridad);
  });

  readonly alcance = computed(() => {
    const prioridad = this.prioridadSeleccionada();

    return prioridad === 'Todas'
      ? 'Todas las prioridades'
      : `Prioridad ${prioridad.toLowerCase()}`;
  });

  readonly resumen = computed<ResumenTickets>(() => {
    const inicial: ResumenTickets = {
      total: 0,
      abiertos: 0,
      enProceso: 0,
      cerrados: 0,
      altaPendientes: 0
    };

    return this.ticketsFiltrados().reduce((acumulado, ticket) => {
      acumulado.total += 1;

      switch (ticket.estado) {
        case 'Abierto':
          acumulado.abiertos += 1;
          break;

        case 'En proceso':
          acumulado.enProceso += 1;
          break;

        case 'Cerrado':
          acumulado.cerrados += 1;
          break;
      }

      if (
        ticket.prioridad === 'Alta' &&
        ticket.estado !== 'Cerrado'
      ) {
        acumulado.altaPendientes += 1;
      }

      return acumulado;
    }, inicial);
  });

  readonly pendientes = computed(() => {
    const resumen = this.resumen();

    return resumen.abiertos + resumen.enProceso;
  });

  readonly porcentajeCerrados = computed(() => {
    const resumen = this.resumen();

    return resumen.total === 0
      ? 0
      : (resumen.cerrados / resumen.total) * 100;
  });

  readonly estadoPrioridadAlta = computed(() => {
    const prioridad = this.prioridadSeleccionada();

    if (prioridad === 'Baja' || prioridad === 'Media') {
      return 'La selección excluye la prioridad alta.';
    }

    return this.resumen().altaPendientes > 0
      ? 'Hay pendientes de prioridad alta.'
      : 'Sin pendientes de prioridad alta.';
  });

  readonly tituloOperacional = computed(() => {
    if (this.resumen().total === 0) {
      return 'Sin tickets en la selección';
    }

    return this.pendientes() === 0
      ? 'Todos los tickets de la selección están cerrados'
      : 'Hay tickets pendientes de cierre';
  });

  readonly textoOperacional = computed(() => {
    const resumen = this.resumen();

    if (resumen.total === 0) {
      return 'Selecciona otra prioridad o registra nuevos tickets.';
    }

    if (this.pendientes() === 0) {
      return `Tickets cerrados: ${resumen.cerrados}.`;
    }

    return [
      `Abiertos: ${resumen.abiertos}.`,
      `En proceso: ${resumen.enProceso}.`,
      `Pendientes de prioridad alta: ${resumen.altaPendientes}.`
    ].join(' ');
  });

  ngOnInit(): void {
    this.cargarTickets();
  }

  cambiarPrioridad(prioridad: FiltroPrioridad): void {
    this.prioridadSeleccionada.set(prioridad);
  }

  limpiarFiltro(): void {
    this.prioridadSeleccionada.set('Todas');
  }

  cargarTickets(): void {
    if (this.cargando()) {
      return;
    }

    this.cargando.set(true);
    this.errorCarga.set('');

    this.ticketService.obtenerTickets()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tickets) => {
          this.tickets.set(tickets);
          this.cargando.set(false);
        },

        error: (error: unknown) => {
          console.error('Error al cargar el dashboard:', error);

          this.errorCarga.set(
            'No fue posible cargar los indicadores. Verifica la API y vuelve a intentarlo.'
          );

          this.cargando.set(false);
        }
      });
  }
}