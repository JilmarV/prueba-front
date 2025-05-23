import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { LoginResponse } from '../../core/auth.models';
import {environment} from '../../../enviroments/enviroment.prod';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private apiUrl = environment.apiUrl;
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject.asObservable();

  loading = false;
  errorMessage = '';
  @Input() show: boolean = false; // Controla la visibilidad del modal
  @Output() close = new EventEmitter<void>();

  loginForm: any;

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private router: Router,
    private http: HttpClient

) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    const loginData = this.loginForm.value;
    const credentials = {
      username: loginData.username ?? '',
      password: loginData.password ?? ''
    };

    this.auth.login(credentials).subscribe({
      next: (res: LoginResponse) => {
        this.auth.saveToken(res.accessToken);
        this.router.navigate(['/home']);
        this.closeModal();
        this.auth.displayAccordingRole(credentials.username);
      },
      error: () => {
        this.errorMessage = 'Credenciales incorrectas.';
        this.loading = false;
      }
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  closeModal() {
    this.loginForm.reset();
    this.close.emit(); // Emitir evento para cerrar el modal
  }

  logout(): void{
    this.auth.cerrarSesionCompleta();
    this.closeModal();
    this.loading = false;
  }
}
