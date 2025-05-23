import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ProductService, Product } from './services/product.service';
import {NgForOf} from '@angular/common';
import {AuthService} from '../../core/auth.service';
import {CartItem, CartService} from '../../pages/cart/services/cart.service';

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  imports: [NgForOf],
  styleUrls: ['./product.component.css']
})

export class ProductosComponent implements OnInit {
  @Output() openLogin = new EventEmitter<void>();
  @Input() limit: number | null = null;
  products: Product[] = [];

  constructor(
    private productsService: ProductService,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.products = this.limit ? data.slice(0, this.limit) : data;
      },
      error: (err) => console.error("Error al cargar los productos", err)
    })
  }

  agregarProducto(product: Product){
    if(!this.authService.isLoggedIn()) {
      this.openLogin.emit();
      return;
    }
    const item: CartItem={
      id: product.id,
      name: product.nombre,
      price: product.salePrice,
      quantity: 1
    };
    this.cartService.addToCart(item);
  }
}


