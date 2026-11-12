import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Sesion, type Rol } from '../../services/sesion';

@Component({
  imports: [],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly sesion = inject(Sesion);
  private readonly router = inject(Router);

  private roles: readonly Rol[] = ['Administrador', 'Soporte', 'Usuario'];

  entrar(rol: Rol): void {
    this.sesion.iniciarDemostracion(rol);
    void this.router.navigateByUrl('/dashboard', { replaceUrl: true });
  }
}
