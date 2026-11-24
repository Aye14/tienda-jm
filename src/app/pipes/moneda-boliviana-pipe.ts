import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monedaBoliviana',
  standalone: true
})
export class MonedaBolivianaPipe implements PipeTransform {
  transform(valor: number | null | undefined): string {
    if (valor === null || valor === undefined || isNaN(valor)) {
      return 'Bs. 0.00';
    }
    return `Bs. ${valor.toFixed(2)}`;
  }
}