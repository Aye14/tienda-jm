import { Component, inject, OnInit } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { IndexeddbService, ItemCarrito } from '../../services/indexeddb';
import { MonedaBolivianaPipe } from '../../pipes/moneda-boliviana-pipe';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [UpperCasePipe, MonedaBolivianaPipe],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class Carrito implements OnInit {
  private indexeddbService = inject(IndexeddbService);
  items: ItemCarrito[] = [];

  async ngOnInit(): Promise<void> {
    await this.cargarCarrito();
  }

  async cargarCarrito(): Promise<void> {
    this.items = await this.indexeddbService.obtenerCarrito();
  }

  async eliminar(carritoId?: number): Promise<void> {
    if (carritoId !== undefined) {
      await this.indexeddbService.eliminarProducto(carritoId);
      await this.cargarCarrito();
    }
  }

  async vaciar(): Promise<void> {
    await this.indexeddbService.vaciarCarrito();
    await this.cargarCarrito();
  }

  get total(): number {
    return this.items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }
}