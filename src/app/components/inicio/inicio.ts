import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Producto, ProductosService } from '../../services/productos';
import { TarjetaProducto } from '../tarjeta-producto/tarjeta-producto';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink, TarjetaProducto],
  templateUrl: './inicio.html'
})
export class Inicio implements OnInit {
  private productosService = inject(ProductosService);
  private cdr = inject(ChangeDetectorRef);

  destacados: Producto[] = [];
  totalUnidadesCarrito = 0;
  mensajeInicio = '';

  async ngOnInit(): Promise<void> {
    await this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    const todos = await this.productosService.obtenerProductos();
    const enOferta = todos.filter(p => p.enOferta);
    this.destacados = (enOferta.length > 0 ? enOferta : todos).slice(0, 3);

    const carrito = await this.productosService.obtenerCarrito();
    this.totalUnidadesCarrito = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    this.cdr.detectChanges();
  }

  async manejarAgregarCarrito(producto: Producto): Promise<void> {
    const res = await this.productosService.agregarAlCarritoConStock(producto, 1);
    if (!res.ok) {
      this.mensajeInicio = res.mensaje;
      alert(res.mensaje);
      this.cdr.detectChanges();
      return;
    }

    this.mensajeInicio = `Se agregó "${producto.nombre}" al carrito.`;
    alert(`Producto seleccionado: ${producto.nombre} (Bs. ${producto.precio})`);
    await this.cargarDatos();
  }
}