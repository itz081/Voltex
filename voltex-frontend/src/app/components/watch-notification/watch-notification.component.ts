import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VoltexStateService } from '../../services/voltex-state';
import { Supercargador } from '../../productos';

@Component({
  selector: 'app-watch-notification',
  standalone: true,           // Soporte para standalone components
  imports: [CommonModule],    // Soporte para directivas básicas como @if y bindings
  templateUrl: './watch-notification.component.html',
  styleUrl: './watch-notification.component.css'
})
export class WatchNotificationComponent implements OnInit {
  @Input() productoReciente!: Supercargador;
  isVisible: boolean = true; // Controla la visibilidad del overlay del reloj

  constructor(
    private state: VoltexStateService,
    private router: Router
  ) {}

  ngOnInit() {
    // Si se carga desde la ruta directa (/watch), tomamos el último del estado global
    if (!this.productoReciente) {
      const prods = this.state.productos();
      if (prods && prods.length > 0) {
        this.productoReciente = prods[prods.length - 1];
      }
    }
  }

  // Método para ver el producto en móvil (redirige al flujo de pago rápido o tienda)
  verProducto() {
    this.isVisible = false;
    if (this.productoReciente && this.productoReciente.id) {
      this.router.navigate(['/quick-pay', this.productoReciente.id]);
    } else {
      this.router.navigate(['/productos']);
    }
  }

  // Método para descartar la notificación del smartwatch
  descartar() {
    this.isVisible = false;
  }
}