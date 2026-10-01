import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '../models/ticket';

@Injectable({
    providedIn: 'root'
})
export class TicketService {

    private apiUrl = 'http://localhost:3000/tickets';

    constructor(private http:HttpClient) {}

    obtenerTickets():Observable<Ticket[]> {
        return this.http.get<Ticket[]>(this.apiUrl);
    }
}