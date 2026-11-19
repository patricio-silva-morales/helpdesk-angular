import { Routes } from '@angular/router';
import { requiereRoles, sesionGuard } from './interceptor/guards/acceso-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'sin-acceso',
    canActivate: [sesionGuard],
    loadComponent: () => import('./pages/sin-acceso/sin-acceso').then(m => m.SinAcceso)
  },
  {
    path: 'dashboard',
    canActivate: [sesionGuard],
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard)    
  },
  {
    path: 'tickets',
    canActivate: [sesionGuard],
    loadComponent: () => import('./pages/tickets/tickets').then(m => m.Tickets)    
  },
  {
    path: 'tickets/nuevo',
    canActivate: [sesionGuard],
    loadComponent: () => import('./pages/ticket-form/ticket-form').then(m => m.TicketForm)
  },
  {
    path: 'tickets/editar/:id',
    canActivate: [sesionGuard],
    loadComponent: () => import('./pages/ticket-form/ticket-form').then(m => m.TicketForm)
  },
  {
    path: 'tickets/:id',
    canActivate: [sesionGuard],
    loadComponent: () => import('./pages/ticket-detalle/ticket-detalle').then(m => m.TicketDetalle)
  },
  {
    path: 'kanban',
    canActivate: [requiereRoles('Soporte', 'Administrador')],
    loadComponent: () => import('./pages/kanban/kanban').then(m => m.Kanban)  
  },
  {
    path: 'reportes',
    canActivate: [requiereRoles('Administrador')],
    loadComponent: () => import('./pages/reportes/reportes').then(m => m.Reportes)    
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];