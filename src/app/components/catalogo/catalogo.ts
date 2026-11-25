
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemCarrito, Producto, ProductosService } from '../../services/productos';
import { TarjetaProducto } from '../tarjeta-producto/tarjeta-producto';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, DecimalPipe, FormsModule, TarjetaProducto],
  templateUrl: './catalogo.html'
})
export class Catalogo implements OnInit {
  private productosService = inject(ProductosService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  productos: Producto[] = [];
  carrito: ItemCarrito[] = [];
  categoriaSeleccionada = 'Todas';
  textoBusqueda = '';
  mensajeCarrito = '';

  async ngOnInit(): Promise<void> {
    await this.cargarTodo();
  }

  async cargarTodo(): Promise<void> {
    this.productos = await this.productosService.obtenerProductos();
    this.carrito = await this.productosService.obtenerCarrito();
    this.cdr.detectChanges();
  }

  get productosFiltrados(): Producto[] {
    const texto = (this.textoBusqueda || '').trim().toLowerCase();

    return this.productos.filter(p => {
      const coincideCategoria =
        !this.categoriaSeleccionada ||
        this.categoriaSeleccionada === 'Todas' ||
        (p.categoria || '').toLowerCase() === this.categoriaSeleccionada.toLowerCase();

      const coincideTexto =
        !texto ||
        (p.nombre || '').toLowerCase().includes(texto) ||
        (p.descripcion || '').toLowerCase().includes(texto);

      return coincideCategoria && coincideTexto;
    });
  }

  get totalUnidadesCarrito(): number {
    return this.carrito.reduce((acc, item) => acc + item.cantidad, 0);
  }

  get totalCarrito(): number {
    return this.carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }

  get totalPagarCarrito(): number {
    return this.totalCarrito;
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
    await this.cargarTodo();
  }

  async quitarDelCarrito(item: ItemCarrito | number): Promise<void> {
    await this.productosService.cancelarItem(item);
    this.mensajeCarrito = 'Producto quitado y stock devuelto.';
    await this.cargarTodo();
  }

  async vaciarCarrito(): Promise<void> {
    await this.productosService.vaciar();
    this.mensajeCarrito = 'Carrito vaciado y stock devuelto.';
    await this.cargarTodo();
  }

  async irARegistroPedido(): Promise<void> {
    await this.router.navigate(['/registro-pedido']);
  }

  async irACarrito(): Promise<void> {
    await this.router.navigate(['/carrito']);
  }
}