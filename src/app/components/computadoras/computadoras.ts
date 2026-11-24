import { Component, inject, OnInit } from '@angular/core';
import { Producto, ProductosService } from '../../services/productos';
import { TarjetaProducto } from '../tarjeta-producto/tarjeta-producto';

@Component({
  selector: 'app-computadoras',
  standalone: true,
  imports: [TarjetaProducto],
  templateUrl: './computadoras.html',
  styleUrl: './computadoras.css'
})
export class Computadoras implements OnInit {
  private productosService = inject(ProductosService);
  productosComputadoras: Producto[] = [];

  ngOnInit(): void {
    this.productosComputadoras = this.productosService.obtenerPorCategoria('computadoras');
  }

  manejarAgregarCarrito(producto: Producto): void {
    // Aquí César conectará luego el guardado en IndexedDB
    alert(`Producto seleccionado: ${producto.nombre} (Bs. ${producto.precio})`);
  }
}