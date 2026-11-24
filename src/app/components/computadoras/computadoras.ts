import { Component, inject, OnInit } from '@angular/core';
import { Producto, ProductosService } from '../../services/productos';
import { IndexeddbService } from '../../services/indexeddb';
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
  private indexeddbService = inject(IndexeddbService);
  productosComputadoras: Producto[] = [];

  ngOnInit(): void {
    this.productosComputadoras = this.productosService.obtenerPorCategoria('computadoras');
  }

  async manejarAgregarCarrito(producto: Producto): Promise<void> {
    await this.indexeddbService.agregarProducto(producto);
    alert(`"${producto.nombre}" guardado en el carrito (IndexedDB).`);
  }
}