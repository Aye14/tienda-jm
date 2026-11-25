import { Injectable } from '@angular/core';

export interface Producto {
  id: number;
  nombre: string;
  categoria: 'computadoras' | 'celulares';
  precio: number;
  stock: number;
  enOferta: boolean;
  descripcion: string;
  imagen: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private listaProductos: Producto[] = [
    // --- ARTÍCULOS DE COMPUTADORAS ---
    {
      id: 1,
      nombre: 'Mouse Gamer RGB Óptico',
      categoria: 'computadoras',
      precio: 85,
      stock: 15,
      enOferta: true,
      descripcion: 'Mouse ergonómico con 6 botones programables y sensor de 3200 DPI.',
      imagen: '/img/mouse-gamer.jpg'
    },
    {
      id: 2,
      nombre: 'Teclado Mecánico Retroiluminado',
      categoria: 'computadoras',
      precio: 220,
      stock: 4,
      enOferta: false,
      descripcion: 'Teclado mecánico switches blue, distribución en español.',
      imagen: '/img/teclado-mecanico.png'
    },
    {
      id: 3,
      nombre: 'Memoria USB 64GB Kingston 3.2',
      categoria: 'computadoras',
      precio: 65,
      stock: 25,
      enOferta: true,
      descripcion: 'Almacenamiento portátil de alta velocidad en carcasa metálica.',
      imagen: '/img/usb-64gb.jpg'
    },
    {
      id: 4,
      nombre: 'Auriculares Diadema con Micrófono',
      categoria: 'computadoras',
      precio: 140,
      stock: 8,
      enOferta: false,
      descripcion: 'Audio estéreo ideal para clases virtuales, oficina y juegos.',
      imagen: '/img/auriculares-pc.jpg'
    },

    // --- ACCESORIOS DE CELULARES ---
    {
      id: 5,
      nombre: 'Cargador Rápido 33W Tipo C',
      categoria: 'celulares',
      precio: 95,
      stock: 12,
      enOferta: true,
      descripcion: 'Cubo de carga rápida con protección contra sobrecalentamiento.',
      imagen: '/img/cargador-33w.jpg'
    },
    {
      id: 6,
      nombre: 'Funda Antigolpes Transparente',
      categoria: 'celulares',
      precio: 35,
      stock: 30,
      enOferta: false,
      descripcion: 'Silicona reforzada en esquinas compatible con varios modelos.',
      imagen: '/img/funda-celular.jpg'
    },
    {
      id: 7,
      nombre: 'Vidrio Templado 9D Full Cover',
      categoria: 'celulares',
      precio: 25,
      stock: 3,
      enOferta: true,
      descripcion: 'Protector de pantalla resistente a rayones e impactos.',
      imagen: '/img/vidrio-templado.jpg'
    },
    {
      id: 8,
      nombre: 'Cable Reforzado USB-C a USB-C',
      categoria: 'celulares',
      precio: 45,
      stock: 18,
      enOferta: false,
      descripcion: 'Cable trenzado de 1.5 metros para carga y transferencia de datos.',
      imagen: '/img/cable-usbc.jpg'
    }
  ];

  obtenerPorCategoria(categoria: 'computadoras' | 'celulares'): Producto[] {
    return this.listaProductos.filter(prod => prod.categoria === categoria);
  }
}