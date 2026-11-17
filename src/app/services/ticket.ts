import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api';
import { Ticket } from '../models/ticket';

// AGREGADO: filtros de la consulta paginada.
export interface FiltrosTickets {
  texto: string;
  estado: string;
  prioridad: string;
  fechaDesde: string;
  fechaHasta: string;
}

// AGREGADO: estructura de la respuesta paginada.
export interface PaginaTickets {
  count: number;
  next: string | null;
  previous: string | null;
  results: Ticket[];
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/tickets`;

  obtenerTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }

  // AGREGADO: solicita la página visible y sus filtros.
  obtenerTicketsPaginados(
    pagina: number,
    tamanoPagina: number,
    filtros: FiltrosTickets
  ): Observable<PaginaTickets> {
    let params = new HttpParams()
      .set('page', pagina)
      .set('page_size', tamanoPagina);

    for (const [campo, valor] of Object.entries(filtros)) {
      const limpio = valor.trim();

      if (limpio) {
        params = params.set(campo, limpio);
      }
    }

    return this.http.get<PaginaTickets>(`${this.apiUrl}/paginados`, { params });
  }

  obtenerTicket(id: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  crearTicket(ticket: Omit<Ticket, 'id'>): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, ticket);
  }

  actualizarTicket(id: string, ticket: Omit<Ticket, 'id'>): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${id}`, ticket);
  }

  eliminarTicket(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}