import { Routes } from '@angular/router';
import { Inicio } from './components/inicio/inicio';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
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
  { path: '**', redirectTo: 'inicio' }
];