import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import {FooterComponent} from './components/footer/footer.component';
import { AdminService } from './pages/admin/services/admin.service';


@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, LoginComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private visitService: AdminService) {}

  ngOnInit(): void {
    this.visitService.registerVisit();
  }
  title(title: any) {
      throw new Error('Method not implemented.');
  }
  showLogin = false;

  openLoginModal() {
    this.showLogin = true;
  }

  closeLoginModal() {
    this.showLogin = false;
  }
}
