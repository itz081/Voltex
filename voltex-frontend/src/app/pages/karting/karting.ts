import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { VoltexApiService } from '../../services/voltex-api.service';
import { VoltexStateService } from '../../services/voltex-state';

@Component({
  selector: 'app-karting',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './karting.html',
  styleUrl: './karting.css'
})
export class KartingComponent implements OnInit {
  productosKarting: any[] = [];
  cargando = true;

  constructor(
    private voltexApi: VoltexApiService,
    private state: VoltexStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProductosDeBaseDeDatos();
  }

  // Petición directa a la BD sin datos estáticos
  cargarProductosDeBaseDeDatos() {
    this.cargando = true;
    this.voltexApi.getProductos().subscribe({
      next: (data: any) => {
        // Aseguramos extraer el arreglo sin importar cómo venga envuelto por el backend
        const lista = Array.isArray(data) ? data : (data.productos || data.data || []);
        
        // Filtramos estrictamente los productos de la categoría Karting registrados en tu BD
        this.productosKarting = lista.filter((p: any) => {
          const cat = (p.category || p.categoria || '').toLowerCase();
          const nom = (p.name || p.nombre || '').toLowerCase();
          return cat.includes('karting') || nom.includes('karting') || cat.includes('kart');
        });

        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al conectar con la base de datos de 7VOLTEX:', err);
        this.productosKarting = [];
        this.cargando = false;
      }
    });
  }

  // Botón de Volver inteligente según la sesión activa
  volverSegunSesion() {
    const user = this.state.usuarioActual();
    if (user && user.email) {
      this.router.navigate(['/usuario']);
    } else {
      this.router.navigate(['/tienda']);
    }
  }

  // Enviar el producto real al carrito / línea de ensamblaje
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
}