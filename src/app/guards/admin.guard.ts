import {CanActivate, CanActivateFn, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from '../core/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getUserFromToken();

    if (user && user.role === 'ADMIN') {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}
