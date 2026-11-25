import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ItemCarrito, ProductosService } from '../../services/productos';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, DecimalPipe, RouterLink],
  templateUrl: './carrito.html'
})
export class Carrito implements OnInit {
  private productosService = inject(ProductosService);
  private cdr = inject(ChangeDetectorRef);

  items: ItemCarrito[] = [];

  async ngOnInit(): Promise<void> {
    await this.cargarCarrito();
  }

  async cargarCarrito(): Promise<void> {
    this.items = await this.productosService.obtenerCarrito();
    this.cdr.detectChanges();
  }

  get total(): number {
    return this.items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }

  async cancelarItem(item: ItemCarrito | number): Promise<void> {
    await this.productosService.cancelarItem(item);
    await this.cargarCarrito();
  }

  async vaciar(): Promise<void> {
    await this.productosService.vaciar();
    await this.cargarCarrito();
  }
}