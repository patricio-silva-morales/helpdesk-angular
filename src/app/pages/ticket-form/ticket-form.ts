import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
export class TicketForm implements OnInit {

  private fb = inject(FormBuilder);
  private ticketService = inject(TicketService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  modoEdicion = signal(false);
  cargando = signal(false);
  guardando = signal(false);
  errorCarga = signal(false);
  errorGuardado = signal(false);

  ticketId: string | null = null;
  fechaCreacionOriginal = '';

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

    this.ticketService.obtenerTicket(id).subscribe({
      next: (ticket) => {
        this.fechaCreacionOriginal = ticket.fechaCreacion;

        this.ticketForm.patchValue({
          asunto: ticket.asunto,
          descripcion: ticket.descripcion,
          estado: ticket.estado,
          prioridad: ticket.prioridad
        });

        this.cargando.set(false);
      },

      error: (error) => {
        console.error('Error al cargar el ticket:', error);
        this.errorCarga.set(true);
        this.cargando.set(false);
      }
    });
  }

  guardar(): void {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.errorGuardado.set(false);

    const valores = this.ticketForm.getRawValue();

    const ticket: Omit<Ticket, 'id'> = {
      asunto: valores.asunto ?? '',
      descripcion: valores.descripcion ?? '',
      estado: valores.estado ?? 'Abierto',
      prioridad: valores.prioridad ?? 'Media',
      fechaCreacion: this.modoEdicion()
        ? this.fechaCreacionOriginal
        : new Date().toISOString().split('T')[0]
    };

    if (this.modoEdicion() && this.ticketId !== null) {

      this.ticketService.actualizarTicket(
        this.ticketId,
        ticket
      ).subscribe({
        next: () => {
          this.guardando.set(false);
          this.router.navigate(['/tickets']);
        },

        error: (error) => {
          console.error('Error al actualizar el ticket:', error);
          this.errorGuardado.set(true);
          this.guardando.set(false);
        }
      });

      return;
    }

    this.ticketService.crearTicket(ticket).subscribe({
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