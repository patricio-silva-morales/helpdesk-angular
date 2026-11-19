import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { finalize, Observable } from 'rxjs';
import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-ticket-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './ticket-form.html',
  styleUrl: './ticket-form.css'
})
export class TicketForm implements OnInit {

  private fb = inject(FormBuilder);
  private ticketService = inject(TicketService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private readonly destroyRef = inject(DestroyRef);

  readonly modoEdicion = signal(false);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly errorCarga = signal(false);
  readonly errorGuardado = signal('');

  ticketId: string | null = null;
  fechaCreacionOriginal = '';

  readonly ticketForm = this.fb.group({
    asunto: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ]
    ],

    descripcion: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]
    ],

    estado: [
      'Abierto' as Ticket['estado'],
      Validators.required
    ],

    prioridad: [
      'Media' as Ticket['prioridad'],
      Validators.required
    ]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id !== null) {
      this.ticketId = id;
      this.modoEdicion.set(true);
      this.cargarTicket(this.ticketId);
    }
  }

  cargarTicket(id: string): void {
    this.cargando.set(true);
    this.errorCarga.set(false);

    this.ticketService.obtenerTicket(id).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.cargando.set(false))
    )    
    .subscribe({
      next: ticket => {
        this.fechaCreacionOriginal = ticket.fechaCreacion;

        this.ticketForm.patchValue({
          asunto: ticket.asunto,
          descripcion: ticket.descripcion,
          estado: ticket.estado,
          prioridad: ticket.prioridad
        });

        this.cargando.set(false);
      },

      error: error => {
        console.error('Error al cargar el ticket:', error);
        this.errorCarga.set(true);
        this.cargando.set(false);
      }
    });
  }

  guardar(): void {
    if (this.guardando() || this.cargando() || this.errorCarga()) {
      return;
    }

    const controles = this.ticketForm.controls;

    controles.asunto.setValue(controles.asunto.value?.trim() ?? '');
    controles.descripcion.setValue(controles.descripcion.value?.trim() ?? '');

    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }
    
    const hoy = new Date();
    const valores = this.ticketForm.getRawValue();

    const fechaHoy = [hoy.getFullYear(), String(hoy.getMonth() + 1).padStart(2, '0'), String(hoy.getDate()).padStart(2, '0')].join('-');
    
    const ticket: Omit<Ticket, 'id'> = {
      asunto: valores.asunto ?? '',
      descripcion: valores.descripcion ?? '',
      estado: valores.estado ?? 'Abierto',
      prioridad: valores.prioridad ?? 'Media',
      fechaCreacion: this.modoEdicion()
        ? this.fechaCreacionOriginal
        : fechaHoy
    };

    this.guardando.set(true);
    this.errorGuardado.set('');

    const operacion = this.ticketId !== null ? this.ticketService.actualizarTicket(this.ticketId, ticket) : this.ticketService.crearTicket(ticket);

    operacion.pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.guardando.set(false))
    ).subscribe({
      next: () => {
        void this.router.navigate(['/tickets']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al guardar el ticket:', error);
        this.errorGuardado.set(this.mensajeDeError(error));
      }
    });    
  }

  private mensajeDeError(error: HttpErrorResponse): string {
    switch (error.status) {
      case 0: 
        return 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.';
      case 400:
        return 'Error de validación. Por favor, revisa los datos ingresados.';
      case 401:
        return 'No estás autorizado para realizar esta acción.';
      case 404:
        return 'El ticket no fue encontrado.';
      case 500:
        return 'Error interno del servidor. Por favor, intenta nuevamente más tarde.';
      default:
        return 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
    }
  }

  cancelar(): void {
    if (!this.guardando()) {
      void this.router.navigate(['/tickets']);
    }
  }
}