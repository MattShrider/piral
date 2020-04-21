import { PiralEventMap } from 'piral-base';
import { SharedData } from './data';
import { PiralCustomEventMap } from './custom';

export interface PiralStorage {
  /**
   * Sets the value of an item.
   * @param name The name of the item to set.
   * @param data The new value of the item.
   * @param expires Optional expiration information.
   */
  setItem(name: string, data: string, expires?: string): void;
  /**
   * Gets the value of an item.
   * @param name The name of the item to look for.
   */
  getItem(name: string): string | null;
  /**
   * Removes an item from the storage.
   * @param name The name of the item to remove.
   */
  removeItem(name: string): void;
}

export interface Disposable {
  /**
   * Disposes the created resource.
   */
  (): void;
}

export interface PiralStoreDataEvent<TKey extends keyof SharedData = any> {
  /**
   * The name of the item that was stored.
   */
  name: TKey;
  /**
   * The storage target of the item.
   */
  target: string;
  /**
   * The value that was stored.
   */
  value: SharedData[TKey];
  /**
   * The owner of the item.
   */
  owner: string;
  /**
   * The expiration of the item.
   */
  expires: number;
}

declare module 'piral-base/lib/types' {
  interface EventEmitter {
    on<K extends keyof PiralEventMap>(type: K, callback: Listener<K extends "store-data" ? PiralStoreDataEvent<K> : PiralEventMap[K]>): EventEmitter;
  }

  interface PiralEventMap extends PiralCustomEventMap {
    'store-data': PiralStoreDataEvent;
  }
}
