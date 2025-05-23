import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../core/auth.service';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  private userId: number | null = null;

  constructor(private auth: AuthService) {
    try {
      const user = this.auth.getUserFromToken();
      this.userId = user?.id || null;

      const storageKey = this.getStorageKey();
      const savedCart = storageKey ? localStorage.getItem(storageKey) : null;

      if (savedCart) {
        this.cartItemsSubject.next(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error initializing cart', error);
      this.userId = null;
    }
  }

  private getStorageKey(): string | null {
    return this.userId !== null ? `cart_${this.userId}` : 'cart_guest';
  }

  addToCart(item: CartItem): void {
    const items = [...this.cartItemsSubject.value];
    const existingItem = items.find(p => p.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      items.push(item);
    }

    this.cartItemsSubject.next(items);
    const storageKey = this.getStorageKey();
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }

  getItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  removeItem(index: number): void {
    const items = [...this.cartItemsSubject.value];
    items.splice(index, 1);
    this.cartItemsSubject.next(items);
    const storageKey = this.getStorageKey();
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    const storageKey = this.getStorageKey();
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  }
}
