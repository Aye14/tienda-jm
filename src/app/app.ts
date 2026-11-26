import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);

  esInicio = signal(this.router.url === '/' || this.router.url.startsWith('/inicio'));
  menuInicioAbierto = signal(false);

  constructor() {
    this.router.events
      .pipe(filter((ev): ev is NavigationEnd => ev instanceof NavigationEnd))
      .subscribe(ev => {
        const ruta = ev.urlAfterRedirects || ev.url;
        const enInicio = ruta === '/' || ruta.startsWith('/inicio');
        this.esInicio.set(enInicio);
        if (!enInicio) {
          this.menuInicioAbierto.set(false);
        }
      });
  }

  alternarMenuInicio(): void {
    this.menuInicioAbierto.update(v => !v);
  }

  cerrarMenuInicio(): void {
    this.menuInicioAbierto.set(false);
  }
}