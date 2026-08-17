import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // 1. Agregamos Router
import { VoltexStateService } from '../../services/voltex-state';
import { FooterUsuario } from '../../components/footer-usuario/footer-usuario';

@Component({
  selector: 'app-deseos',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterUsuario],
  templateUrl: './deseos.html',
  styleUrl: './deseos.css'
})
export class Deseos implements OnInit {
  wishlist: any[] = [];

  constructor(
    public state: VoltexStateService, 
    private router: Router // 2. Inyectamos Router
  ) {}

  ngOnInit() {
    // 3. PROTECCIÓN: Si no hay usuario logueado, redirigir al login
    const usuario = this.state.usuarioActual();
    if (!usuario || !usuario.email) {
      alert("Debes iniciar sesión para acceder a tu Lista de Deseos.");
      this.router.navigate(['/login']);
      return;
    }

    // 4. Si hay usuario, cargamos la lista
    const estadoService: any = this.state;
    if (typeof estadoService.wishlist === 'function') {
      this.wishlist = estadoService.wishlist();
    } else if (typeof estadoService.deseos === 'function') {
      this.wishlist = estadoService.deseos();
    } else if (Array.isArray(estadoService.wishlist)) {
      this.wishlist = estadoService.wishlist;
    }
  }

  eliminarDeLista(id: number, event: Event) {
    event.stopPropagation(); 
    const estadoService: any = this.state;
    
    if (typeof estadoService.removerDeWishlist === 'function') {
      estadoService.removerDeWishlist(id);
    } else if (typeof estadoService.eliminarDeDeseos === 'function') {
      estadoService.eliminarDeDeseos(id);
    }

    // Refrescamos la vista
    if (typeof estadoService.wishlist === 'function') {
      this.wishlist = estadoService.wishlist();
    } else if (typeof estadoService.deseos === 'function') {
      this.wishlist = estadoService.deseos();
    }
  }

  agregarAlCarrito(item: any, event: Event) {
    event.stopPropagation();
    
    // 5. PROTECCIÓN ADICIONAL: Validar de nuevo antes de agregar
    const usuario = this.state.usuarioActual();
    if (!usuario || !usuario.email) {
      alert("Inicia sesión para poder gestionar componentes.");
      this.router.navigate(['/login']);
      return;
    }

    this.state.añadirAlCarrito(item); 
    alert(`${item.name || item.nombre} movido a la línea de ensamblaje.`);
  }
}