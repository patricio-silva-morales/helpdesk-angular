import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Tickets } from './pages/tickets/tickets';
import { TicketForm } from './pages/ticket-form/ticket-form';
import { TicketDetalle } from './pages/ticket-detalle/ticket-detalle';
import { Kanban } from './pages/kanban/kanban';
import { Reportes } from './pages/reportes/reportes';

import { Login } from './pages/login/login';
import { requiereRoles, sesionGuard } from './guards/acceso-guard';
import { SinAcceso } from './pages/sin-acceso/sin-acceso';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'sin-acceso',
    canActivate: [sesionGuard],
    component: SinAcceso
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [sesionGuard]
  },
  {
    path: 'tickets',
    component: Tickets,
    canActivate: [sesionGuard]
  },
  {
    path: 'tickets/nuevo',
    component: TicketForm,
    canActivate: [sesionGuard]
  },
  {
    path: 'tickets/editar/:id',
    component: TicketForm,
    canActivate: [sesionGuard]
  },
  {
    path: 'tickets/:id',
    component: TicketDetalle,
    canActivate: [sesionGuard]
  },
  {
    path: 'kanban',
    component: Kanban,
    canActivate: [requiereRoles('Soporte', 'Administrador')]
  },
  {
    path: 'reportes',
    component: Reportes,
    canActivate: [requiereRoles('Administrador')]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];