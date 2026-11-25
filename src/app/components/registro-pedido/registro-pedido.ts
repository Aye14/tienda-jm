import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ItemCarrito, Producto, ProductosService } from '../../services/productos';

@Component({
  selector: 'app-registro-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, RouterLink],
  templateUrl: './registro-pedido.html'
})
export class RegistroPedido implements OnInit {
  private productosService = inject(ProductosService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  productosDisponibles: Producto[] = [];
  itemsCarrito: ItemCarrito[] = [];
  itemsDirectos: ItemCarrito[] = [];

  productoSeleccionadoId = 0;
  cantidadSeleccionada = 1;

  clienteNombre = '';
  clienteTelefono = '';
  clienteDireccion = '';
  notas = '';

  errorMsg = '';
  guardando = false;

  async ngOnInit(): Promise<void> {
    await this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    this.productosDisponibles = await this.productosService.obtenerProductos();
    this.itemsCarrito = await this.productosService.obtenerCarrito();
    if (this.productosDisponibles.length > 0 && !this.productoSeleccionadoId) {
      this.productoSeleccionadoId = this.productosDisponibles[0].id;
    }
    this.cdr.detectChanges();
  }

  get usandoCarrito(): boolean {
    return this.itemsCarrito.length > 0;
  }

  get itemsActivos(): ItemCarrito[] {
    return this.usandoCarrito ? this.itemsCarrito : this.itemsDirectos;
  }

  get total(): number {
    return this.itemsActivos.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  }

  agregarProductoDirecto(): void {
    this.errorMsg = '';
    const prod = this.productosDisponibles.find(p => p.id === Number(this.productoSeleccionadoId));

    if (!prod) {
      this.errorMsg = 'Selecciona un producto válido.';
      return;
    }

    if (this.cantidadSeleccionada < 1) {
      this.errorMsg = 'La cantidad debe ser al menos 1.';
      return;
    }

    const existente = this.itemsDirectos.find(i => i.id === prod.id);
    const cantidadTotal = (existente ? existente.cantidad : 0) + Number(this.cantidadSeleccionada);

    if (cantidadTotal > prod.stock) {
      this.errorMsg = `Stock insuficiente para "${prod.nombre}". Solo hay ${prod.stock} unid. disponibles.`;
      return;
    }

    if (existente) {
      existente.cantidad = cantidadTotal;
    } else {
      this.itemsDirectos.push({
        id: prod.id,
        nombre: prod.nombre,
        categoria: prod.categoria,
        precio: prod.precio,
        cantidad: Number(this.cantidadSeleccionada),
        imagen: prod.imagen
      });
    }

    this.cantidadSeleccionada = 1;
    this.cdr.detectChanges();
  }

  quitarItemDirecto(id: number): void {
    this.itemsDirectos = this.itemsDirectos.filter(i => i.id !== id);
    this.cdr.detectChanges();
  }

  validarFormulario(): string | null {
    if (this.clienteNombre.trim().length < 3) {
      return 'Ingresa el nombre completo del cliente (mínimo 3 caracteres).';
    }
    if (!/^[0-9]{7,8}$/.test(this.clienteTelefono.trim())) {
      return 'Ingresa un número de teléfono válido de 7 u 8 dígitos.';
    }
    if (this.clienteDireccion.trim().length < 5) {
      return 'Ingresa una dirección de entrega válida.';
    }
    if (this.itemsActivos.length === 0) {
      return 'Agrega al menos un producto al pedido.';
    }
    return null;
  }

  async guardarPedido(): Promise<void> {
    this.errorMsg = '';
    const errorValidacion = this.validarFormulario();
    if (errorValidacion) {
      this.errorMsg = errorValidacion;
      this.cdr.detectChanges();
      return;
    }

    this.guardando = true;
    this.cdr.detectChanges();

    try {
      const res = await this.productosService.registrarPedidoConValidacion({
        clienteNombre: this.clienteNombre,
        clienteTelefono: this.clienteTelefono,
        clienteDireccion: this.clienteDireccion,
        notas: this.notas,
        itemsPedido: this.itemsActivos,
        descontarStockAhora: !this.usandoCarrito
      });

      if (!res.ok) {
        this.errorMsg = res.mensaje;
        return;
      }

      alert(`Pedido #${res.pedidoId ?? ''} registrado correctamente.`);
      this.router.navigate(['/pedidos']);
    } catch {
      this.errorMsg = 'Ocurrió un error inesperado al registrar el pedido.';
    } finally {
      this.guardando = false;
      this.cdr.detectChanges();
    }
  }
}