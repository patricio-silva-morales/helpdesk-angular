import { type HttpInterceptorFn } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

import { inject } from '@angular/core';

import { API_BASE_URL } from '../config/api';
import { Sesion } from '../services/sesion';

export const tokenInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
  const token = inject(Sesion).actual()?.token;

  if (!token) {
    return siguiente(peticion);
  }

  const documento = inject(DOCUMENT);
  const url = new URL(peticion.url, documento.baseURI);
  const api = new URL(API_BASE_URL);

  // MODIFICADO: limita el Bearer a tickets y usuarios del túnel.
  const esRecursoProtegido =
    url.origin === api.origin &&
    /^\/(?:tickets|usuarios|usuario)(?:\/|$)/.test(url.pathname);

  if (!esRecursoProtegido) {
    return siguiente(peticion);
  }

  return siguiente(
    peticion.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};