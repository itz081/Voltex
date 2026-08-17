import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { VoltexStateService } from '../../services/voltex-state';
import { VoltexApiService } from '../../services/voltex-api.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  submitted = false;

  // Carrito real extraído del estado global de la escudería
  cartItems: any[] = [];

  constructor(
    private fb: FormBuilder,
    public state: VoltexStateService,
    private voltexApi: VoltexApiService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\\/([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
    });
  }

  ngOnInit(): void {
    const itemsDelEstado = this.state.carrito();
    
    this.cartItems = itemsDelEstado.map((item: any) => ({
      ...item,
      quantity: item.quantity || 1,
      price: item.price || item.precio || 0,
      name: item.name || item.nombre || 'Componente Voltex'
    }));
  }

  // Controles manipulables de cantidad
  aumentarCantidad(index: number) {
    this.cartItems[index].quantity++;
  }

  disminuirCantidad(index: number) {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
    } else {
      this.eliminarItem(index);
    }
  }

  eliminarItem(index: number) {
    this.cartItems.splice(index, 1);
  }

  get subtotal(): number {
    return this.cartItems.reduce((acc, item) => acc + ((item.price || item.precio) * item.quantity), 0);
  }

  get shipping(): number {
    return this.cartItems.length > 0 ? 250 : 0;
  }

  get total(): number {
    return this.subtotal + (this.cartItems.length > 0 ? this.shipping : 0);
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.cartItems.length === 0) {
      alert('La línea de pits está vacía. Selecciona componentes antes de procesar el pago.');
      return;
    }

    if (this.checkoutForm.valid) {
      const orderPayload = {
        customer: this.checkoutForm.value,
        items: this.cartItems,
        totalAmount: this.total,
        fecha: new Date().toISOString()
      };
      
      console.log('Enviando orden real al backend:', orderPayload);

      // Si tienes un endpoint para guardar órdenes en tu VoltexApiService, lo llamarías así:
      /*
      this.voltexApi.crearOrden(orderPayload).subscribe({
        next: (res) => {
          console.log('Orden guardada en BD:', res);
        },
        error: (err) => console.error('Error al guardar orden:', err)
      });
      */

      alert('¡Pedido procesado con éxito en la escudería! Redirigiendo a tu panel...');
      
      // Vaciamos el carrito del estado global
      this.state.carrito.set([]);
      
      // Redirigimos de vuelta a la vista de usuario como pediste
      this.router.navigate(['/usuario']);
    } else {
      console.warn('El formulario contiene errores de validación.');
    }
  }
}