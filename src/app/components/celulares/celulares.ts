import { Component, inject, OnInit } from '@angular/core';
import { Producto, ProductosService } from '../../services/productos';
import { IndexeddbService } from '../../services/indexeddb';
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
  private indexeddbService = inject(IndexeddbService);
  productosCelulares: Producto[] = [];

  ngOnInit(): void {
    this.productosCelulares = this.productosService.obtenerPorCategoria('celulares');
  }

  async manejarAgregarCarrito(producto: Producto): Promise<void> {
    await this.indexeddbService.agregarProducto(producto);
    alert(`"${producto.nombre}" guardado en el carrito (IndexedDB).`);
  }
}