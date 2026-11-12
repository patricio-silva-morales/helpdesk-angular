import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Sesion } from '../services/sesion';

export const tokenInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
  const token = inject(Sesion).actual()?.token;

  const url = new URL(peticion.url, 'http://localhost:4200');
  const esApiTickets = url.origin === 'http://localhost:3000' && (url.pathname === '/tickets' || url.pathname.startsWith('/tickets/'));

  if (!token || !esApiTickets) {
    return siguiente(peticion);
  }

  return siguiente(
    peticion.clone({
      setHeaders: { Authorization: 'Bearer ${token}'}
    })
  ); 
  
};
