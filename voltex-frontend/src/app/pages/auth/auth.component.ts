import { Component, OnInit } from '@angular/core'; // <-- Asegúrate de importar OnInit
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VoltexStateService } from '../../services/voltex-state';
import { VoltexApiService } from '../../services/voltex-api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private state: VoltexStateService,
    private voltexApi: VoltexApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si ya hay una sesión activa, redirigimos automáticamente según su rol
    const user = this.state.usuarioActual();
    if (user && user.email) {
      if (user.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/usuario']);
      }
    }
  }

  encenderMotor() {
    if (!this.email) {
      alert('Por favor ingresa tu correo electrónico.');
      return;
    }

    this.voltexApi.login({ email: this.email }).subscribe({
      next: (response) => {
        if (response.success) {
          this.state.usuarioActual.set({
            email: response.user.email,
            role: response.user.role
          });

          if (response.user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/usuario']);
          }
        } else {
          alert(response.message);
        }
      },
      error: (err: any) => {
        console.error('Error de conexión con el servidor:', err);
        alert('No se pudo conectar con el servidor de Pits.');
      }
    });
  }
}