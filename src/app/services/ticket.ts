import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '../models/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/tickets';

  obtenerTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }

  obtenerTicket(id: string):Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  crearTicket(ticket: Omit<Ticket, 'id'>): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, ticket);
  }

  actualizarTicket(id: string, ticket: Omit<Ticket, 'id'>):Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${id}`, ticket);
  }

  eliminarTicket(id:string):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}