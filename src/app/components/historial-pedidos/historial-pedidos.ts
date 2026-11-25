import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EstadoPedido, Pedido, ProductosService } from '../../services/productos';

@Component({
  selector: 'app-historial-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, DecimalPipe, RouterLink],
  templateUrl: './historial-pedidos.html'
})
export class HistorialPedidos implements OnInit {
  private productosService = inject(ProductosService);
  private cdr = inject(ChangeDetectorRef);

  pedidos: Pedido[] = [];
  estadoFiltro: 'Todos' | EstadoPedido = 'Todos';

  async ngOnInit(): Promise<void> {
    await this.cargarPedidos();
  }

  async cargarPedidos(): Promise<void> {
    this.pedidos = await this.productosService.obtenerPedidos();
    this.cdr.detectChanges();
  }

  get pedidosFiltrados(): Pedido[] {
    if (this.estadoFiltro === 'Todos') {
      return this.pedidos;
    }
    return this.pedidos.filter(p => p.estado === this.estadoFiltro);
  }
}