import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf} from '@angular/common';
import { ProductosComponent } from '../../components/product/product.component';
import { LoginComponent} from '../../components/login/login.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProductosComponent, LoginComponent, NgIf],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  showLogin = false;

  openLoginModal(){
    console.log("Mostrando el login");
    this.showLogin = true;
  }

  closeLoginModal(){
    this.showLogin = false;
  }
}
