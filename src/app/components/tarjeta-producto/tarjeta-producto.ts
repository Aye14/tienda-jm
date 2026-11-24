import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { Producto } from '../../services/productos';
import { MonedaBolivianaPipe } from '../../pipes/moneda-boliviana-pipe';
import { DestacarOferta } from '../../directives/destacar-oferta';

@Component({
  selector: 'app-tarjeta-producto',
  standalone: true,
  imports: [UpperCasePipe, DatePipe, MonedaBolivianaPipe, DestacarOferta],
  templateUrl: './tarjeta-producto.html',
  styleUrl: './tarjeta-producto.css'
})
export class TarjetaProducto {
  @Input({ required: true }) producto!: Producto;
  @Output() agregarAlCarrito = new EventEmitter<Producto>();

  fechaConsulta = new Date();

  onAgregar(): void {
    this.agregarAlCarrito.emit(this.producto);
  }
}