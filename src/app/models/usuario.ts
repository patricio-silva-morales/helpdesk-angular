export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    rol: 'Administrador' | 'Soporte' | 'Usuario';
}