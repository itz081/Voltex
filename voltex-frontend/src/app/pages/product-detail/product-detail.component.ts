import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VoltexStateService } from '../../services/voltex-state';
import { VoltexApiService } from '../../services/voltex-api.service';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductoDetalleComponent implements OnInit {
  producto: any = null;
  cargando: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private state: VoltexStateService,
    private voltexApi: VoltexApiService
  ) {}

  ngOnInit(): void {
    // Capturamos el ID que viene en la ruta (ej. /producto/3)
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      const productoId = Number(idParam);
      this.cargarDetalleProducto(productoId);
    } else {
      this.cargando = false;
    }
  }

  cargarDetalleProducto(id: number) {
    this.cargando = true;

    this.voltexApi.getProductoPorId(id).subscribe({
      next: (data: any) => {
        console.log("🔍 PRODUCTO INDIVIDUAL RECIBIDO:", data);
        
        // Extraemos el objeto asegurando compatibilidad con cualquier formato de la API
        this.producto = data.product || data.producto || data.data || data;
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al cargar el detalle del componente:', err);
        this.cargando = false;
      }
    });
  }

  agregarAlCarrito(producto: any) {
    const supercargadorAdaptado: any = {
      id: producto.id,
      nombre: producto.name || producto.nombre,
      descripcion: producto.description || producto.descripcion,
      precio: producto.price || producto.precio,
      imagen: producto.image || producto.imageUrl || producto.imagen || 'assets/img/supercargador-default.jpg',
      categoria: producto.category || producto.categoria,
      marca: producto.marca || 'Voltex Pro',        
      modalidad: producto.modalidad || 'Inducción Forzada'   
    };

    this.state.añadirAlCarrito(supercargadorAdaptado);
    alert(`${supercargadorAdaptado.nombre} se ha añadido a tu orden técnica.`);
    this.router.navigate(['/checkout']); 
  }

  volverSegunSesion() {
    // Si el usuario actual es admin o cliente, los mandamos a su respectiva vista
    const usuario = this.state.usuarioActual();
    if (usuario && usuario.role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/usuario']);
    }
  }
}