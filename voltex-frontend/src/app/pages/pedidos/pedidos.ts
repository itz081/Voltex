import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { VoltexStateService } from '../../services/voltex-state';
import { VoltexApiService } from '../../services/voltex-api.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css'
})
export class PedidosComponent implements OnInit {
  pedidos: any[] = [];
  usuarioEmail: string | null = null;
  cargando = true;

  constructor(
    private state: VoltexStateService,
    private voltexApi: VoltexApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.state.usuarioActual();
    if (!user || !user.email) {
      alert("Debes iniciar sesión para consultar el historial de Pits.");
      this.router.navigate(['/login']);
      return;
    }

    this.usuarioEmail = user.email;
    this.cargarHistorialPedidos(user.email);
  }

  cargarHistorialPedidos(email: string) {
    this.voltexApi.getOrdenesPorUsuario(email).subscribe({
      next: (data: any) => {
        this.pedidos = Array.isArray(data) ? data : (data.ordenes || data.data || []);
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al cargar historial de pedidos:', err);
        this.cargando = false;
      }
    });
  }
}