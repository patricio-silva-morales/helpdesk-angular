import { Component, computed, input, signal } from '@angular/core';

export interface SerieTickets {
  etiqueta: string;
  cantidad: number;
  color: string;
}

@Component({
  selector: 'app-grafico-tickets',
  templateUrl: './grafico-tickets.html',
  styleUrl: './grafico-tickets.css'
})
export class GraficoTickets {
  readonly titulo = input.required<string>();
  readonly tipo = input.required<'bar' | 'doughnut'>();
  readonly series = input.required<readonly SerieTickets[]>();

  readonly activa = signal<string | null>(null);
  readonly maximo = computed(() =>
    Math.max(1, ...this.series().map(serie => serie.cantidad))
  );

  readonly total = computed(() =>
    this.series().reduce((suma, serie) => suma + serie.cantidad, 0)
  );

  readonly segmentos = computed(() => {
    const total = this.total();
    let inicio = 0;

    return this.series().map(serie => {
      const longitud = total > 0 ? (serie.cantidad / total) * 100 : 0;
      const segmento = { ...serie, inicio, longitud };
      inicio += longitud;
      return segmento;
    });
  });

  readonly detalle = computed(() =>
    this.series().find(serie => serie.etiqueta === this.activa())
  );

  porcentaje(cantidad: number): string {
    const total = this.total();

    return new Intl.NumberFormat('es-CL', {
      style: 'percent',
      maximumFractionDigits: 1
    }).format(total > 0 ? cantidad / total : 0);
  }
}