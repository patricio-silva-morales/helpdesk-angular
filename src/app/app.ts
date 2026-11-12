import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

import { Sesion } from './services/sesion';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink, RouterLinkActive,
    MatToolbarModule, MatSidenavModule,
    MatIconModule, MatButtonModule,
    MatListModule  
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('help-desk');

  protected readonly sesion = inject(Sesion);
  protected readonly router = inject(Router);

  cerrarSesion(): void {
    this.sesion.cerrar();
    void this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
