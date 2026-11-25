import { Injectable } from '@angular/core';
import { Producto } from './productos';

export interface ItemCarrito extends Producto {
  carritoId?: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class IndexeddbService {
  private dbName = 'TiendaDB';
  private dbVersion = 1;
  private storeName = 'carrito';

  private abrirDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event: any) => {
        const db: IDBDatabase = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, {
            keyPath: 'carritoId',
            autoIncrement: true
          });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async agregarProducto(producto: Producto): Promise<void> {
    const db = await this.abrirDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);

      // Creamos un objeto limpio sin propiedades extrañas
      const item: ItemCarrito = {
        id: producto.id,
        nombre: producto.nombre,
        categoria: producto.categoria,
        precio: producto.precio,
        stock: producto.stock,
        enOferta: producto.enOferta,
        descripcion: producto.descripcion,
        imagen: producto.imagen,
        cantidad: 1
      };

      store.add(item);

      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  }

  async obtenerCarrito(): Promise<ItemCarrito[]> {
    const db = await this.abrirDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const req = store.getAll();

      req.onsuccess = () => {
        const resultado = req.result || [];
        db.close();
        resolve(resultado);
      };
      req.onerror = () => {
        db.close();
        reject(req.error);
      };
    });
  }

  async eliminarProducto(carritoId: number): Promise<void> {
    const db = await this.abrirDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      store.delete(carritoId);

      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  }

  async vaciarCarrito(): Promise<void> {
    const db = await this.abrirDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      store.clear();

      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  }
}