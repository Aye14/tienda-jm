import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monedaBoliviana',
})
export class MonedaBolivianaPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
