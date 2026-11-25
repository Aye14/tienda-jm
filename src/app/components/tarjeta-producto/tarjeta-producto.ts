import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, NgClass, DecimalPipe, TitleCasePipe } from '@angular/common';
import { Producto } from '../../services/productos';

@Component({
  selector: 'app-tarjeta-producto',
  standalone: true,
  imports: [TitleCasePipe, DatePipe, DecimalPipe, NgClass],
  templateUrl: './tarjeta-producto.html',
  styleUrl: './tarjeta-producto.css'
})
export class TarjetaProducto {
  @Input({ required: true }) producto!: Producto;
  @Output() agregarAlCarrito = new EventEmitter<Producto>();

  fechaConsulta = new Date();

  solicitarPedido(): void {
    if (this.producto.stock <= 0) {
      return;
    }
    this.agregarAlCarrito.emit(this.producto);
  }
}