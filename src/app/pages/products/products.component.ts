import {Component} from '@angular/core';
import { NgIf} from '@angular/common';
import {ProductosComponent} from '../../components/product/product.component';
import { LoginComponent} from '../../components/login/login.component';


@Component({
  selector: 'app-products2',
  imports: [
    ProductosComponent,
    NgIf,
    LoginComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  showLogin = false;

  openLoginModal(){
    console.log("Mostrando el login");
    this.showLogin = true;
  }

  closeLoginModal(){
    this.showLogin = false;
  }
}
