import { Component, input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

type VarianteIndicador = 
    | 'neutra'
    | 'principal'
    | 'azul'
    | 'ambar'
    | 'verde'
    | 'roja';

@Component({
    selector: 'app-tarjeta-indicador',
    templateUrl: './tarjeta-indicador.html',
    styleUrl: './tarjeta-indicador.css',
    imports: [MatIconModule]
})
export class TarjetaIndicador {
    readonly titulo = input.required<string>();    
    readonly valor = input.required<number | string>();

    readonly descripcion = input('');
    readonly apoyo = input('');
    readonly unidad = input('');

    readonly icono = input('analytics');
    readonly variante = input<VarianteIndicador>('neutra');
}
