export interface Ticket {
    id: string;
    asunto: string;
    descripcion: string;
    estado: 'Abierto' | 'En proceso' | 'Cerrado';
    prioridad: 'Baja' | 'Media' | 'Alta';
    fechaCreacion: string;
}