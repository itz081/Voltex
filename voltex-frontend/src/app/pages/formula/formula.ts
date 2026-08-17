import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { VoltexApiService } from '../../services/voltex-api.service';
import { VoltexStateService } from '../../services/voltex-state';

@Component({
  selector: 'app-formula',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './formula.html',
  styleUrl: './formula.css',
})
export class Formula implements OnInit {
  productosFormula: any[] = [];
  cargando = true;

  constructor(
    private voltexApi: VoltexApiService,
    private state: VoltexStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProductosDeBaseDeDatos();
  }

  // Consulta directa a tu base de datos y filtrado por categoría Fórmula
  cargarProductosDeBaseDeDatos() {
    this.cargando = true;
    this.voltexApi.getProductos().subscribe({
      next: (data: any) => {
        const lista = Array.isArray(data) ? data : (data.productos || data.data || []);
        
        // Filtramos estrictamente por la categoría o nombre Fórmula
        this.productosFormula = lista.filter((p: any) => {
          const cat = (p.category || p.categoria || '').toLowerCase();
          const nom = (p.name || p.nombre || '').toLowerCase();
          return cat.includes('formula') || nom.includes('formula') || cat.includes('fórmula');
        });

        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al conectar con la base de datos de 7VOLTEX (Fórmula):', err);
        this.productosFormula = [];
        this.cargando = false;
      }
    });
  }

  // Botón de Volver inteligente según la sesión
  volverSegunSesion() {
    const user = this.state.usuarioActual();
    if (user && user.email) {
      this.router.navigate(['/usuario']);
    } else {
      this.router.navigate(['/tienda']);
    }
  }

  // Agregar a la línea de ensamblaje (carrito)
  agregarAlCarrito(producto: any) {
    const supercargadorAdaptado: any = {
      id: producto.id,
      nombre: producto.name || producto.nombre,
      descripcion: producto.description || producto.descripcion,
      precio: producto.price || producto.precio,
      imagen: producto.image || producto.imageUrl || producto.imagen,
      categoria: producto.category || producto.categoria,
      marca: producto.marca || 'Voltex Formula Spec',      
      modalidad: producto.modalidad || 'Inducción de Alto Rendimiento'   
    };

    this.state.añadirAlCarrito(supercargadorAdaptado);
    alert(`${supercargadorAdaptado.nombre} se ha añadido a tu orden técnica.`);
    this.router.navigate(['/checkout']);
  }
}