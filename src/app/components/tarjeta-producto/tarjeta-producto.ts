import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Producto } from '../../services/productos';

@Component({
  selector: 'app-tarjeta-producto',
  standalone: true,
  imports: [],
  templateUrl: './tarjeta-producto.html',
  styleUrl: './tarjeta-producto.css'
})
export class TarjetaProducto {
  // Recibe el producto del componente padre
  @Input({ required: true }) producto!: Producto;

  // Envía el producto seleccionado al componente padre
  @Output() agregarAlCarrito = new EventEmitter<Producto>();

  onAgregar(): void {
    this.agregarAlCarrito.emit(this.producto);
  }
}