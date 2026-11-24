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
      const item: ItemCarrito = { ...producto, cantidad: 1 };
      const req = store.add(item);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async obtenerCarrito(): Promise<ItemCarrito[]> {
    const db = await this.abrirDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async eliminarProducto(carritoId: number): Promise<void> {
    const db = await this.abrirDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const req = store.delete(carritoId);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async vaciarCarrito(): Promise<void> {
    const db = await this.abrirDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const req = store.clear();

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}