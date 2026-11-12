import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Sesion, type Rol } from '../services/sesion'; 

export const sesionGuard: CanActivateFn = (route, state) => {
  const sesion = inject(Sesion);
  const router = inject(Router);

  return sesion.actual() !== null ? true : router.createUrlTree(['/login']) 
  
};

export function requiereRoles(...roles: Rol[]): CanActivateFn {
  return () => {
    const sesion = inject(Sesion);
    const router = inject(Router);

    if (sesion.actual() === null) {
      return router.createUrlTree(['/login']);
    }

    if (sesion.tieneAlgunRol(roles)) {
      return true;
    }

    return router.createUrlTree(['sin-acceso']);
  };
}
