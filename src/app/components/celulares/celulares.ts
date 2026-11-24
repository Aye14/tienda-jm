import { Component, inject, OnInit } from '@angular/core';
import { Producto, ProductosService } from '../../services/productos';
import { TarjetaProducto } from '../tarjeta-producto/tarjeta-producto';

@Component({
  selector: 'app-celulares',
  standalone: true,
  imports: [TarjetaProducto],
  templateUrl: './celulares.html',
  styleUrl: './celulares.css'
})
export class Celulares implements OnInit {
  private productosService = inject(ProductosService);
  productosCelulares: Producto[] = [];

  ngOnInit(): void {
    this.productosCelulares = this.productosService.obtenerPorCategoria('celulares');
  }

  manejarAgregarCarrito(producto: Producto): void {
    // Aquí César conectará luego el guardado en IndexedDB
    alert(`Producto seleccionado: ${producto.nombre} (Bs. ${producto.precio})`);
  }
}