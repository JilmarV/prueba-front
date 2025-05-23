import { Component } from '@angular/core';
import {AuthService} from '../../core/auth.service';
import {CommonModule} from '@angular/common';
import {CartService, CartItem} from './services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems: CartItem[]= [];

  constructor(
    public auth: AuthService,
    public cartService: CartService
  ) {
    this.cartService.cartItems$.subscribe(items =>{
      this.cartItems = items;
    });
  }

  getTotal(): number{
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  removeItem(index: number): void {
    this.cartService.removeItem(index);
  }
}
