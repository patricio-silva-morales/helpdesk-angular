import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { Sesion } from '../../services/sesion';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly sesion = inject(Sesion);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  username = '';
  password = '';

  readonly enviando = signal(false);
  readonly mensajeError = signal('');

  // MODIFICADO: valida las credenciales antes de navegar.
  entrar(): void {
    const username = this.username.trim();

    if (!username || !this.password || this.enviando()) {
      return;
    }

    this.enviando.set(true);
    this.mensajeError.set('');

    this.sesion.iniciarSesion(username, this.password)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.enviando.set(false)),
      )
      .subscribe({
        next: () => {
          this.password = '';
          void this.router.navigateByUrl('/dashboard', { replaceUrl: true });
        },
        error: (error: HttpErrorResponse) => {
          switch (error.status) {
            case 0:
              this.mensajeError.set(
                'No se pudo conectar con la API. Revisa el túnel y CORS.',
              );
              break;

            case 400:
            case 401:
              this.mensajeError.set('Revisa el usuario y la contraseña.');
              break;

            case 403:
              this.mensajeError.set('El servidor rechazó el acceso de esta cuenta.');
              break;

            case 429:
              this.mensajeError.set('Demasiados intentos. Espera un momento.');
              break;

            default:
              this.mensajeError.set('La API no pudo iniciar la sesión.');
          }
        },
      });
  }
}