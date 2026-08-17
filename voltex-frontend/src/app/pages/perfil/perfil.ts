import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VoltexStateService } from '../../services/voltex-state';
import { FooterUsuario } from '../../components/footer-usuario/footer-usuario';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterUsuario],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class PerfilComponent implements OnInit {
  usuarioEmail: string = 'piloto@7voltex.com';
  nombreEscuderia: string = 'Escudería 7VOLTEX Racing';
  historialCompras: any[] = [];

  constructor(private state: VoltexStateService) {}

  ngOnInit() {
    const estadoService: any = this.state;

    // 1. Obtenemos el usuario de forma dinámica y segura desde el servicio o backend
    if (typeof estadoService.usuarioActual === 'function') {
      const user = estadoService.usuarioActual();
      if (user) {
        this.usuarioEmail = user.email || user.correo || this.usuarioEmail;
        this.nombreEscuderia = user.escuderia || user.nombreEscuderia || this.nombreEscuderia;
      }
    } else if (estadoService.usuarioActual) {
      this.usuarioEmail = estadoService.usuarioActual.email || this.usuarioEmail;
    }

    // 2. Obtenemos el historial de compras conectado al estado/backend
    if (typeof estadoService.historialCompras === 'function') {
      this.historialCompras = estadoService.historialCompras() || [];
    } else if (Array.isArray(estadoService.historial)) {
      this.historialCompras = estadoService.historial;
    } else if (typeof estadoService.obtenerHistorial === 'function') {
      // Si tu backend se conecta mediante un método HTTP observable
      estadoService.obtenerHistorial().subscribe({
        next: (data: any[]) => {
          this.historialCompras = data;
        },
        error: (err: any) => console.error('Error al cargar telemetría de compras:', err)
      });
    }
  }

  // Retorna la clase CSS adecuada para el estado de la orden
  getStatusClass(status: string): string {
    if (!status) return 'status-default';
    switch (status.toUpperCase()) {
      case 'EN PISTA':
      case 'PROCESANDO':
        return 'status-processing';
      case 'ENTREGADO':
      case 'COMPLETADO':
        return 'status-success';
      default:
        return 'status-default';
    }
  }
}