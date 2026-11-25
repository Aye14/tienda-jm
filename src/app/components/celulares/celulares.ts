import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto, ProductosService } from '../../services/productos';
import { TarjetaProducto } from '../tarjeta-producto/tarjeta-producto';

@Component({
  selector: 'app-celulares',
  standalone: true,
  imports: [CommonModule, TarjetaProducto],
  templateUrl: './celulares.html'
})
export class Celulares implements OnInit {
  private productosService = inject(ProductosService);
  private cdr = inject(ChangeDetectorRef);

  productosCelulares: Producto[] = [];
  mensajeCarrito = '';

  async ngOnInit(): Promise<void> {
    await this.cargarProductos();
  }

  async cargarProductos(): Promise<void> {
    const todos = await this.productosService.obtenerProductos();
    this.productosCelulares = todos.filter(
      p => (p.categoria || '').toLowerCase() === 'celulares'
    );
    this.cdr.detectChanges();
  }

  async manejarAgregarCarrito(producto: Producto): Promise<void> {
    const res = await this.productosService.agregarAlCarritoConStock(producto, 1);
    if (!res.ok) {
      this.mensajeCarrito = res.mensaje;
      alert(res.mensaje);
      this.cdr.detectChanges();
      return;
    }

    this.mensajeCarrito = `Se agregó "${producto.nombre}" al carrito.`;
    alert(`Producto seleccionado: ${producto.nombre} (Bs. ${producto.precio})`);
    await this.cargarProductos();
  }
}