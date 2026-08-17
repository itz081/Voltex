import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { VoltexStateService } from '../../services/voltex-state';
import { VoltexApiService } from '../../services/voltex-api.service'; // Importamos el servicio API
import { SidebarFiltersComponent } from '../../components/sidebar-filters/sidebar-filters.component';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarFiltersComponent],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent implements OnInit {

  constructor(
    public state: VoltexStateService,
    private voltexApi: VoltexApiService, // Inyectamos el servicio para pedir los datos
    private router: Router
  ) {}

  ngOnInit(): void {
    // Forzamos la carga de productos reales apenas se inicia el componente
    this.cargarProductosReales();
  }

  cargarProductosReales() {
    this.voltexApi.getProductos().subscribe({
      next: (data: any) => {
        // Extraemos los datos reales ignorando el envoltorio del backend
        const lista = Array.isArray(data) ? data : (data.productos || data.data || []);
        
        // Actualizamos la señal del estado con la lista real
        this.state.setProductos(lista); 
      },
      error: (err: any) => {
        console.error('Error al sincronizar inventario de Pits:', err);
      }
    });
  }

  agregarAlCarrito(producto: any) {
    // Adaptamos los campos reales para el carrito
    const supercargadorAdaptado: any = {
      id: producto.id,
      nombre: producto.nombre || producto.name,
      descripcion: producto.descripcion || producto.description,
      precio: producto.precio || producto.price,
      imagen: producto.imagen || producto.image || producto.imageUrl,
      categoria: producto.categoria || producto.category,
      marca: producto.marca || 'Voltex Pro',
      modalidad: producto.modalidad || 'Inducción'
    };

    this.state.añadirAlCarrito(supercargadorAdaptado);
    alert(`${supercargadorAdaptado.nombre} añadido a la orden de pits.`);
    this.router.navigate(['/checkout']);
  }
}