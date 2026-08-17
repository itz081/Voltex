import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Supercargador } from '../../productos';

@Component({
  selector: 'app-products-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-grid.component.html',
  styleUrl: './products-grid.component.css'
})
export class ProductsGridComponent {
  // Recibimos la lista de supercargadores desde el componente padre app.ts
  @Input() listaProductos: Supercargador[] = [];
  state: any;

  agregarAlCarrito(producto: any) {
  this.state.agregarProductoAlCarrito(producto);
}
}