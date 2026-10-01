export interface Ticket {
    id: number;
    asunto: string;
    descripcion: string;
    estado: 'Abierto' | 'En proceso' | 'Cerrado';
    prioridad: 'Baja' | 'Media' | 'Alta';
    fechaCreacion: string;
}