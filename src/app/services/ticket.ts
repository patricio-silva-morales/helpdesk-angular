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

  crearTicket(ticket: Omit<Ticket, 'id'>): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, ticket);
  }
}