import { Injectable } from '@angular/core';

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcion: string;
  imagen: string;
  enOferta?: boolean;
}

export interface ItemCarrito {
  id: number;
  carritoId?: number;
  productoId?: number;
  nombre: string;
  categoria?: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

export type EstadoPedido = 'Pendiente' | 'Completado' | 'Cancelado';

export interface Pedido {
  id?: number;
  fecha: string;
  clienteCi?: string;
  clienteNombre: string;
  clienteTelefono: string;
  clienteDireccion: string;
  notas?: string;
  estado: EstadoPedido;
  items: ItemCarrito[];
  total: number;
}

const DB_NAME = 'TiendaJM_DB';
const DB_VERSION = 10;

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private productosIniciales: Producto[] = [
    {
      id: 1,
      nombre: 'Mouse Gamer RGB Óptico',
      categoria: 'Computadoras',
      precio: 85,
      stock: 15,
      descripcion: 'Mouse ergonómico con 6 botones programables y sensor de 3200 DPI.',
      imagen: 'img/mouse-gamer.jpg',
      enOferta: false
    },
    {
      id: 2,
      nombre: 'Teclado Mecánico Retroiluminado',
      categoria: 'Computadoras',
      precio: 220,
      stock: 4,
      descripcion: 'Teclado mecánico switches blue, distribución en español.',
      imagen: 'img/teclado-mecanico.png',
      enOferta: false
    },
    {
      id: 3,
      nombre: 'Memoria USB 64GB Kingston 3.2',
      categoria: 'Computadoras',
      precio: 65,
      stock: 25,
      descripcion: 'Almacenamiento portátil de alta velocidad en carcasa metálica.',
      imagen: 'img/usb-64gb.jpg',
      enOferta: true
    },
    {
      id: 4,
      nombre: 'Auriculares Diadema con Micrófono',
      categoria: 'Computadoras',
      precio: 140,
      stock: 8,
      descripcion: 'Audio estéreo ideal para clases virtuales y oficina.',
      imagen: 'img/auriculares-pc.jpg',
      enOferta: false
    },
    {
      id: 5,
      nombre: 'Cargador Carga Rápida 33W',
      categoria: 'Celulares',
      precio: 75,
      stock: 12,
      descripcion: 'Adaptador USB-C de carga rápida con protección contra sobrecarga.',
      imagen: 'img/cargador-33w.jpg',
      enOferta: true
    },
    {
      id: 6,
      nombre: 'Funda Antigolpes Reforzada',
      categoria: 'Celulares',
      precio: 45,
      stock: 3,
      descripcion: 'Bordes reforzados y acabado antideslizante para protección diaria.',
      imagen: 'img/funda-celular.jpg',
      enOferta: false
    },
    {
      id: 7,
      nombre: 'Cable HDMI 2.0 Alta Velocidad 4K',
      categoria: 'Accesorios',
      precio: 35,
      stock: 18,
      descripcion: 'Cable HDMI para video y audio en alta definición en TV, monitor o consola.',
      imagen: 'img/cable-hdmi.jpg',
      enOferta: false
    },
    {
      id: 8,
      nombre: 'Adaptador Wi-Fi USB Dual Band',
      categoria: 'Accesorios',
      precio: 60,
      stock: 10,
      descripcion: 'Receptor inalámbrico USB 2.4GHz / 5GHz para PC de escritorio y laptops.',
      imagen: 'img/adaptador-wifi.jpg',
      enOferta: true
    },
    {
      id: 9,
      nombre: 'Mando Inalámbrico PS4 DualShock',
      categoria: 'Accesorios',
      precio: 180,
      stock: 6,
      descripcion: 'Control inalámbrico compatible con PlayStation 4 y PC con vibración dual.',
      imagen: 'img/mando-ps4.jpg',
      enOferta: true
    }
  ];

  private abrirDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('productos')) {
          const storeProd = db.createObjectStore('productos', { keyPath: 'id' });
          this.productosIniciales.forEach(p => storeProd.put(p));
        }
        if (!db.objectStoreNames.contains('carrito')) {
          db.createObjectStore('carrito', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('pedidos')) {
          db.createObjectStore('pedidos', { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => db.close();
        resolve(db);
      };

      request.onerror = () => reject(request.error);
    });
  }

  private async asegurarAlmacenes(db: IDBDatabase): Promise<IDBDatabase> {
    const faltanProductos = !db.objectStoreNames.contains('productos');
    const faltanCarrito = !db.objectStoreNames.contains('carrito');
    const faltanPedidos = !db.objectStoreNames.contains('pedidos');

    if (!faltanProductos && !faltanCarrito && !faltanPedidos) {
      return db;
    }

    const siguienteVersion = db.version + 1;
    db.close();

    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, siguienteVersion);
      req.onupgradeneeded = () => {
        const upgraded = req.result;
        if (!upgraded.objectStoreNames.contains('productos')) {
          const storeProd = upgraded.createObjectStore('productos', { keyPath: 'id' });
          this.productosIniciales.forEach(p => storeProd.put(p));
        }
        if (!upgraded.objectStoreNames.contains('carrito')) {
          upgraded.createObjectStore('carrito', { keyPath: 'id' });
        }
        if (!upgraded.objectStoreNames.contains('pedidos')) {
          upgraded.createObjectStore('pedidos', { keyPath: 'id', autoIncrement: true });
        }
      };
      req.onsuccess = () => {
        const upgraded = req.result;
        upgraded.onversionchange = () => upgraded.close();
        resolve(upgraded);
      };
      req.onerror = () => reject(req.error);
    });
  }

  private async obtenerConexionLista(): Promise<IDBDatabase> {
    const db = await this.abrirDB();
    return this.asegurarAlmacenes(db);
  }

  async obtenerProductos(): Promise<Producto[]> {
    const db = await this.obtenerConexionLista();

    return new Promise((resolve, reject) => {
      const tx = db.transaction('productos', 'readwrite');
      const store = tx.objectStore('productos');
      const req = store.getAll();

      req.onsuccess = () => {
        const lista: Producto[] = req.result || [];
        if (lista.length === 0) {
          this.productosIniciales.forEach(p => store.put(p));
          resolve(this.productosIniciales.map(p => ({ ...p })));
          return;
        }

        const actualizada = lista.map(item => {
          const inicial = this.productosIniciales.find(p => p.id === item.id);
          if (inicial) {
            const sincronizado: Producto = {
              ...inicial,
              stock: typeof item.stock === 'number' ? item.stock : inicial.stock
            };
            store.put(sincronizado);
            return sincronizado;
          }
          return item;
        });

        for (const inicial of this.productosIniciales) {
          const yaExiste = actualizada.some(p => p.id === inicial.id);
          if (!yaExiste) {
            const nuevo = { ...inicial };
            store.put(nuevo);
            actualizada.push(nuevo);
          }
        }

        resolve(actualizada);
      };

      req.onerror = () => reject(req.error);
    });
  }

  async obtenerProductoPorId(id: number): Promise<Producto | undefined> {
    const productos = await this.obtenerProductos();
    return productos.find(p => p.id === id);
  }

  async agregarAlCarritoConStock(
    producto: Producto,
    cantidad = 1
  ): Promise<{ ok: boolean; mensaje: string }> {
    if (cantidad < 1) {
      return { ok: false, mensaje: 'La cantidad debe ser al menos 1.' };
    }

    const db = await this.obtenerConexionLista();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(['productos', 'carrito'], 'readwrite');
      const prodStore = tx.objectStore('productos');
      const cartStore = tx.objectStore('carrito');

      const getProdReq = prodStore.get(producto.id);
      getProdReq.onsuccess = () => {
        let prodDB: Producto | undefined = getProdReq.result;

        if (!prodDB) {
          const base = this.productosIniciales.find(p => p.id === producto.id) ?? producto;
          prodDB = { ...base };
        }

        if (prodDB.stock < cantidad) {
          resolve({
            ok: false,
            mensaje: `Stock insuficiente para "${prodDB.nombre}".`
          });
          return;
        }

        prodDB.stock -= cantidad;
        prodStore.put(prodDB);

        const local = this.productosIniciales.find(p => p.id === prodDB!.id);
        if (local) local.stock = prodDB.stock;

        const getCartReq = cartStore.get(prodDB.id);
        getCartReq.onsuccess = () => {
          const actual = getCartReq.result;
          const nuevaCant = (actual ? actual.cantidad : 0) + cantidad;
          cartStore.put({
            id: prodDB!.id,
            carritoId: prodDB!.id,
            productoId: prodDB!.id,
            nombre: prodDB!.nombre,
            categoria: prodDB!.categoria,
            precio: prodDB!.precio,
            cantidad: nuevaCant,
            imagen: prodDB!.imagen
          });
        };
      };

      tx.oncomplete = () => resolve({ ok: true, mensaje: 'Producto agregado al carrito.' });
      tx.onerror = () => reject(tx.error);
    });
  }

  async obtenerCarrito(): Promise<ItemCarrito[]> {
    const db = await this.obtenerConexionLista();

    return new Promise((resolve, reject) => {
      const tx = db.transaction('carrito', 'readonly');
      const store = tx.objectStore('carrito');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async eliminarItemCarrito(itemOId: ItemCarrito | number): Promise<void> {
    await this.cancelarItem(itemOId);
  }

  async cancelarItem(itemOId: ItemCarrito | number): Promise<void> {
    const db = await this.obtenerConexionLista();
    const idCarrito = typeof itemOId === 'number' ? itemOId : (itemOId.carritoId ?? itemOId.id);
    const itemPasado = typeof itemOId === 'number' ? undefined : itemOId;

    return new Promise((resolve, reject) => {
      const tx = db.transaction(['productos', 'carrito'], 'readwrite');
      const prodStore = tx.objectStore('productos');
      const cartStore = tx.objectStore('carrito');

      const getReq = cartStore.get(idCarrito);
      getReq.onsuccess = () => {
        const item: ItemCarrito | undefined = getReq.result ?? itemPasado;
        if (item) {
          const idProd = item.productoId ?? item.id;
          const pReq = prodStore.get(idProd);
          pReq.onsuccess = () => {
            const prodDB: Producto | undefined = pReq.result;
            if (prodDB) {
              prodDB.stock += item.cantidad;
              prodStore.put(prodDB);
              const local = this.productosIniciales.find(p => p.id === prodDB.id);
              if (local) local.stock = prodDB.stock;
            }
          };
          cartStore.delete(item.carritoId ?? item.id);
        } else {
          cartStore.delete(idCarrito);
        }
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async vaciar(): Promise<void> {
    const db = await this.obtenerConexionLista();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(['productos', 'carrito'], 'readwrite');
      const prodStore = tx.objectStore('productos');
      const cartStore = tx.objectStore('carrito');

      const getAllReq = cartStore.getAll();
      getAllReq.onsuccess = () => {
        const items: ItemCarrito[] = getAllReq.result || [];
        for (const item of items) {
          const idBuscar = item.productoId ?? item.id;
          const pReq = prodStore.get(idBuscar);
          pReq.onsuccess = () => {
            const prodDB: Producto | undefined = pReq.result;
            if (prodDB) {
              prodDB.stock += item.cantidad;
              prodStore.put(prodDB);
              const local = this.productosIniciales.find(p => p.id === prodDB.id);
              if (local) local.stock = prodDB.stock;
            }
          };
        }
        cartStore.clear();
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async vaciarCarritoConStock(): Promise<void> {
    await this.vaciar();
  }

  async limpiarCarrito(): Promise<void> {
    await this.vaciar();
  }

  async registrarPedidoConValidacion(datos: {
    clienteCi?: string;
    clienteNombre: string;
    clienteTelefono: string;
    clienteDireccion: string;
    notas?: string;
    itemsPedido: ItemCarrito[];
    descontarStockAhora: boolean;
  }): Promise<{ ok: boolean; mensaje: string; pedidoId?: number }> {
    if (!datos.itemsPedido || datos.itemsPedido.length === 0) {
      return { ok: false, mensaje: 'Debes incluir al menos un producto en el pedido.' };
    }

    const db = await this.obtenerConexionLista();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(['pedidos', 'productos', 'carrito'], 'readwrite');
      const pedidosStore = tx.objectStore('pedidos');
      const prodStore = tx.objectStore('productos');
      const cartStore = tx.objectStore('carrito');

      const pedidosExistentesReq = pedidosStore.getAll();
      const prodReq = prodStore.getAll();

      let pedidosExistentes: Pedido[] | null = null;
      let catalogoActual: Producto[] | null = null;

      const intentarGuardar = () => {
        if (pedidosExistentes === null || catalogoActual === null) return;

        const itemsNormalizados: ItemCarrito[] = datos.itemsPedido.map((i, idx) => {
          const prodId = Number(i.productoId ?? i.id ?? idx + 1);
          const precioNum = Number(i.precio) || 0;
          const cantNum = Math.max(1, Number(i.cantidad) || 1);
          return {
            id: Number(i.id ?? prodId),
            carritoId: i.carritoId !== undefined ? Number(i.carritoId) : undefined,
            productoId: prodId,
            nombre: String(i.nombre || 'Producto'),
            categoria: String(i.categoria || 'General'),
            precio: precioNum,
            cantidad: cantNum,
            imagen: String(i.imagen || '')
          };
        });

        if (datos.descontarStockAhora) {
          for (const item of itemsNormalizados) {
            const idBuscar = item.productoId ?? item.id;
            const prodDB = catalogoActual!.find(p => p.id === idBuscar);
            if (!prodDB || prodDB.stock < item.cantidad) {
              resolve({
                ok: false,
                mensaje: `Stock insuficiente para "${item.nombre}".`
              });
              return;
            }
          }

          for (const item of itemsNormalizados) {
            const idBuscar = item.productoId ?? item.id;
            const prodDB = catalogoActual!.find(p => p.id === idBuscar)!;
            prodDB.stock -= item.cantidad;
            prodStore.put(prodDB);
            const local = this.productosIniciales.find(p => p.id === prodDB.id);
            if (local) local.stock = prodDB.stock;
          }
        }

        const idsNumericos = pedidosExistentes!
          .map(p => Number(p.id))
          .filter(n => Number.isFinite(n) && n > 0 && n < 1_000_000_000);
        const siguienteId = idsNumericos.length > 0 ? Math.max(...idsNumericos) + 1 : 1;

        const total = itemsNormalizados.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
        const ciLimpio = String(datos.clienteCi || '').trim();

        const nuevoPedido: Pedido = {
          id: siguienteId,
          fecha: new Date().toISOString(),
          clienteCi: ciLimpio,
          clienteNombre: String(datos.clienteNombre || '').trim(),
          clienteTelefono: String(datos.clienteTelefono || '').trim(),
          clienteDireccion: String(datos.clienteDireccion || '').trim(),
          notas: String(datos.notas || '').trim(),
          estado: 'Pendiente',
          items: itemsNormalizados,
          total
        };

        const reqPut = pedidosStore.put(nuevoPedido);
        reqPut.onsuccess = () => {
          if (!datos.descontarStockAhora) {
            cartStore.clear();
          }
          resolve({
            ok: true,
            mensaje: 'Pedido registrado correctamente.',
            pedidoId: siguienteId
          });
        };
        reqPut.onerror = () => {
          resolve({ ok: false, mensaje: 'Error al guardar el pedido.' });
        };
      };

      pedidosExistentesReq.onsuccess = () => {
        pedidosExistentes = pedidosExistentesReq.result || [];
        intentarGuardar();
      };
      pedidosExistentesReq.onerror = () => {
        pedidosExistentes = [];
        intentarGuardar();
      };

      prodReq.onsuccess = () => {
        catalogoActual = prodReq.result || [];
        intentarGuardar();
      };
      prodReq.onerror = () => {
        catalogoActual = [];
        intentarGuardar();
      };

      tx.onerror = () => reject(tx.error);
    });
  }

  async obtenerPedidos(): Promise<Pedido[]> {
    const db = await this.obtenerConexionLista();

    return new Promise((resolve, reject) => {
      const tx = db.transaction('pedidos', 'readonly');
      const store = tx.objectStore('pedidos');
      const req = store.getAll();
      req.onsuccess = () => {
        const lista: Pedido[] = req.result || [];
        resolve(lista.sort((a, b) => Number(b.id || 0) - Number(a.id || 0)));
      };
      req.onerror = () => reject(req.error);
    });
  }

  async buscarPedidosPorCi(ci: string): Promise<Pedido[]> {
    const limpio = String(ci || '').trim().toLowerCase();
    const todos = await this.obtenerPedidos();
    if (!limpio) return todos;
    return todos.filter(p => (p.clienteCi || '').toLowerCase().includes(limpio));
  }

  async obtenerPedidoPorId(id: number): Promise<Pedido | undefined> {
    const db = await this.obtenerConexionLista();

    return new Promise((resolve, reject) => {
      const tx = db.transaction('pedidos', 'readonly');
      const store = tx.objectStore('pedidos');
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async actualizarEstadoPedido(
    id: number,
    nuevoEstado: EstadoPedido
  ): Promise<{ ok: boolean; mensaje: string }> {
    const db = await this.obtenerConexionLista();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(['pedidos', 'productos'], 'readwrite');
      const pedidosStore = tx.objectStore('pedidos');
      const prodStore = tx.objectStore('productos');

      const getReq = pedidosStore.get(id);
      getReq.onsuccess = () => {
        const pedido: Pedido | undefined = getReq.result;
        if (!pedido) {
          resolve({ ok: false, mensaje: 'Pedido no encontrado.' });
          return;
        }

        if (pedido.estado !== 'Cancelado' && nuevoEstado === 'Cancelado') {
          for (const item of pedido.items) {
            const idBuscar = item.productoId ?? item.id;
            const pReq = prodStore.get(idBuscar);
            pReq.onsuccess = () => {
              const prodDB: Producto | undefined = pReq.result;
              if (prodDB) {
                prodDB.stock += item.cantidad;
                prodStore.put(prodDB);
                const local = this.productosIniciales.find(p => p.id === prodDB.id);
                if (local) local.stock = prodDB.stock;
              }
            };
          }
        }

        pedido.estado = nuevoEstado;
        pedidosStore.put(pedido);
      };

      tx.oncomplete = () => resolve({ ok: true, mensaje: `Estado actualizado a ${nuevoEstado}.` });
      tx.onerror = () => reject(tx.error);
    });
  }

  async cancelarPedidoYDevolverStock(pedidoId?: number): Promise<{ ok: boolean; mensaje: string }> {
    if (!pedidoId) {
      return { ok: false, mensaje: 'ID de pedido no válido.' };
    }
    return this.actualizarEstadoPedido(pedidoId, 'Cancelado');
  }
}