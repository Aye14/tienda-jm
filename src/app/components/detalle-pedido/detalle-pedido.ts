import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Pedido, ProductosService } from '../../services/productos';

@Component({
  selector: 'app-detalle-pedido',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe, RouterLink],
  templateUrl: './detalle-pedido.html'
})
export class DetallePedido implements OnInit {
  private route = inject(ActivatedRoute);
  private productosService = inject(ProductosService);
  private cdr = inject(ChangeDetectorRef);

  pedido?: Pedido;
  noEncontrado = false;

  async ngOnInit(): Promise<void> {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!id) {
      this.noEncontrado = true;
      this.cdr.detectChanges();
      return;
    }

    this.pedido = await this.productosService.obtenerPedidoPorId(id);
    if (!this.pedido) {
      this.noEncontrado = true;
    }
    this.cdr.detectChanges();
  }

  async cancelarPedido(): Promise<void> {
    if (!this.pedido?.id) return;

    const res = await this.productosService.cancelarPedidoYDevolverStock(this.pedido.id);
    alert(res.mensaje);
    this.pedido = await this.productosService.obtenerPedidoPorId(this.pedido.id);
    this.cdr.detectChanges();
  }
}