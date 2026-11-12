import { Injectable, signal } from '@angular/core';
import type { Usuario } from '../models/usuario'; 

export type Rol = Usuario['rol'];

interface SesionActual {
    rol: Rol;
    token: string;
}

@Injectable({ providedIn: 'root'})
export class Sesion {
    private readonly estado = signal<SesionActual | null>(null);
    readonly actual = this.estado.asReadonly();
    
    iniciarDemostracion(rol: Rol): void {
        this.estado.set({
            rol,
            token: `demo-${rol.toLowerCase()}`
        });
    }

    cerrar(): void {
        this.estado.set(null);
    }

    tieneAlgunRol(roles: readonly Rol[]): boolean {
        const sesion = this.actual();
        return sesion !== null && roles.includes(sesion.rol)
    }
}