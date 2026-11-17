import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { type Observable, tap } from 'rxjs';

import { API_BASE_URL } from '../config/api';
import type { Usuario } from '../models/usuario';

export type Rol = Usuario['rol'];

interface SesionActual {
  rol: Rol;
  token: string;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class Sesion {
  private readonly http = inject(HttpClient);
  private readonly estado = signal<SesionActual | null>(null);

  readonly actual = this.estado.asReadonly();

  // MODIFICADO: obtiene el token y el rol desde Django.
  iniciarSesion(username: string, password: string): Observable<SesionActual> {
    return this.http
      .post<SesionActual>(`${API_BASE_URL}/auth/token`, { username, password })
      .pipe(tap(sesion => this.estado.set(sesion)));
  }

  cerrar(): void {
    this.estado.set(null);
  }

  tieneAlgunRol(roles: readonly Rol[]): boolean {
    const sesion = this.actual();
    return sesion !== null && roles.includes(sesion.rol);
  }
}