export interface Usuario {
    id: string;
    nombre: string;
    email: string;
    rol: 'Administrador' | 'Soporte' | 'Usuario';
}