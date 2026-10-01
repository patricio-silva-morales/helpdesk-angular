import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    private apiUrl = 'http://localhost:3000/usuario';

    constructor(private http:HttpClient) {}

    obtenerUsuarios():Observable<Usuario[]> {
        return this.http.get<Usuario[]>(this.apiUrl);
    }
}