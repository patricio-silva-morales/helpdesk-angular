import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-ticket-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './ticket-form.html',
  styleUrl: './ticket-form.css'
})
export class TicketForm {

  private fb = inject(FormBuilder);
  private ticketService = inject(TicketService);
  private router = inject(Router);

  guardando = signal(false);
  errorGuardado = signal(false);

  ticketForm = this.fb.group({
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

  guardar(): void {

    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.errorGuardado.set(false);

    const valores = this.ticketForm.getRawValue();

    const nuevoTicket: Omit<Ticket, 'id'> = {
      asunto: valores.asunto ?? '',
      descripcion: valores.descripcion ?? '',
      estado: valores.estado ?? 'Abierto',
      prioridad: valores.prioridad ?? 'Media',
      fechaCreacion: new Date().toISOString().split('T')[0]
    };

    this.ticketService.crearTicket(nuevoTicket).subscribe({
      next: () => {
        this.guardando.set(false);
        this.router.navigate(['/tickets']);
      },

      error: (error) => {
        console.error('Error al crear el ticket:', error);
        this.errorGuardado.set(true);
        this.guardando.set(false);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/tickets']);
  }
}