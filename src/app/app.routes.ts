import { Routes } from '@angular/router';
import { Inicio } from './components/inicio/inicio';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
  {
    path: 'catalogo',
    loadComponent: () =>
      import('./components/catalogo/catalogo').then(m => m.Catalogo)
  },
  {
    path: 'computadoras',
    loadComponent: () =>
      import('./components/computadoras/computadoras').then(m => m.Computadoras)
  },
  {
    path: 'celulares',
    loadComponent: () =>
      import('./components/celulares/celulares').then(m => m.Celulares)
  },
  {
    path: 'carrito',
    loadComponent: () =>
      import('./components/carrito/carrito').then(m => m.Carrito)
  },
  {
    path: 'registro-pedido',
    loadComponent: () =>
      import('./components/registro-pedido/registro-pedido').then(m => m.RegistroPedido)
  },
  {
    path: 'pedidos',
    loadComponent: () =>
      import('./components/historial-pedidos/historial-pedidos').then(m => m.HistorialPedidos)
  },
  {
    path: 'pedidos/:id',
    loadComponent: () =>
      import('./components/detalle-pedido/detalle-pedido').then(m => m.DetallePedido)
  },
  { path: '**', redirectTo: 'inicio' }
];