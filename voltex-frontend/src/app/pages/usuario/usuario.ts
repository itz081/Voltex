import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; 
import { VoltexStateService } from '../../services/voltex-state';
import { VoltexApiService } from '../../services/voltex-api.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './usuario.html', 
  styleUrl: './usuario.css' 
})
export class Usuario implements OnInit {
  usuarioEmail: string | null = null;
  
  products: any[] = [];
  pedidos: any[] = [];
  listaDeseos: any[] = [];
  cargando = true;

  constructor(
    private state: VoltexStateService,
    private voltexApi: VoltexApiService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    const user = this.state.usuarioActual();
    if (user && user.email) {
      this.usuarioEmail = user.email;
      this.cargarDatosReales(user.email);
    } else {
      this.router.navigate(['/login']);
    }
  }

  cargarDatosReales(email: string) {
    this.cargando = true;

    // 1. Cargamos los productos (Esto es lo principal para quitar el círculo)
    this.voltexApi.getProductos().subscribe({
      next: (data: any) => {
        console.log("📦 PRODUCTOS RECIBIDOS DE LA BD:", data);
        this.products = Array.isArray(data) ? data : (data.productos || data.data || []);
        this.cargando = false; // <--- Desactivamos el indicador de carga aquí mismo
      },
      error: (err: any) => {
        console.error('Error al cargar productos de la BD:', err);
        this.cargando = false; // <--- También se apaga si falla para no congelar la pantalla
      }
    });

    // 2. Cargamos las órdenes del usuario de forma independiente
    this.voltexApi.getOrdenesPorUsuario(email).subscribe({
      next: (data: any) => {
        this.pedidos = Array.isArray(data) ? data : (data.ordenes || data.data || []);
      },
      error: (err: any) => {
        console.error('Error al cargar el historial de pedidos (puede que estén vacíos):', err);
        this.pedidos = []; // Evita que se quede en null o undefined
      }
    });
  }

  agregarAlCarrito(producto: any) {
    const supercargadorAdaptado: any = {
      id: producto.id,
      nombre: producto.name || producto.nombre,
      descripcion: producto.description || producto.descripcion,
      precio: producto.price || producto.precio,
      imagen: producto.image || producto.imageUrl || producto.imagen,
      categoria: producto.category || producto.categoria,
      marca: producto.marca || 'Voltex Pro',        
      modalidad: producto.modalidad || 'Inducción'   
    };

    this.state.añadirAlCarrito(supercargadorAdaptado);
    alert(`${supercargadorAdaptado.nombre} se ha añadido a tu orden técnica.`);
    this.router.navigate(['/checkout']); 
  }

  cerrarSesion() {
    this.state.usuarioActual.set(null);
    this.router.navigate(['/login']);
  }
}