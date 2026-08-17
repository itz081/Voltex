import { Injectable, signal } from '@angular/core';
import { Supercargador, supercargadoresMock } from '../productos';

export interface NotificacionPush {
  id: number;
  titulo: string;
  mensaje: string;
  horaProgramada: string;
  tipo: 'nuevo-producto' | 'promocion' | 'push';
  leida: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VoltexStateService {
  // Usamos los nuevos "Signals" de Angular para que la UI se actualice instantáneamente sin recargar
  public productos = signal<Supercargador[]>(supercargadoresMock);
  public carrito = signal<Supercargador[]>([]);
  public listaDeseos = signal<Supercargador[]>([]);
  public comprasRealizadas = signal<any[]>([]);
  public notificaciones = signal<NotificacionPush[]>([
    {
      id: 1,
      titulo: '¡BIENVENIDO A PITS!',
      mensaje: 'Sistema de telemetría e inducción forzada Voltex activo.',
      horaProgramada: '10:00',
      tipo: 'promocion',
      leida: false
    }
  ]);

  // Usuario firmado actualmente (null = invitado, 'client', 'admin')
  public usuarioActual = signal<{ email: string; role: 'admin' | 'client' } | null>(null);

  constructor() {
    // Intentar recuperar sesión o datos previos si están en el almacenamiento local
    const localProds = localStorage.getItem('voltex_products');
    if (localProds) this.productos.set(JSON.parse(localProds));
  }

  setProductos(nuevosProductos: Supercargador[]) {
    this.productos.set(nuevosProductos);
  }
  
  // AGREGAR PRODUCTO NUEVO (ADMIN)
  agregarProducto(nuevo: Supercargador) {
    const listaActual = this.productos();
    const productosActualizados = [...listaActual, nuevo];
    this.productos.set(productosActualizados);
    localStorage.setItem('voltex_products', JSON.stringify(productosActualizados));

    // Disparar de forma automática una notificación push general
    this.lanzarNotificacion(
      `¡NUEVO KIT: ${nuevo.nombre}!`,
      `El admin subió una unidad de ${nuevo.marca} optimizada para ${nuevo.modalidad}.`,
      'nuevo-producto'
    );
  }

  // PROGRAMAR NOTIFICACIÓN PUSH (ADMIN)
  lanzarNotificacion(titulo: string, mensaje: string, tipo: 'nuevo-producto' | 'promocion' | 'push', hora: string = 'Ahora') {
    const alertas = this.notificaciones();
    const nuevaAlerta: NotificacionPush = {
      id: Date.now(),
      titulo: titulo.toUpperCase(),
      mensaje,
      horaProgramada: hora,
      tipo,
      leida: false
    };
    this.notificaciones.set([nuevaAlerta, ...alertas]);
  }

  // FUNCIONES DEL CARRITO
  añadirAlCarrito(prod: Supercargador) {
    this.carrito.set([...this.carrito(), prod]);
  }

  // ALIAS PARA COMPATIBILIDAD CON DETALLE DE PRODUCTO
  agregarProductoAlCarrito(prod: Supercargador) {
    this.añadirAlCarrito(prod);
  }

  quitarDelCarrito(index: number) {
    const actual = this.carrito();
    actual.splice(index, 1);
    this.carrito.set([...actual]);
  }

  // LISTA DE DESEOS
  alternarListaDeseos(prod: Supercargador) {
    const existe = this.listaDeseos().find(x => x.id === prod.id);
    if (existe) {
      this.listaDeseos.set(this.listaDeseos().filter(x => x.id !== prod.id));
    } else {
      this.listaDeseos.set([...this.listaDeseos(), prod]);
    }
  }

  // SIMULAR COMPRA EXITOSA
  procesarCompra(metodoPago: string) {
    const orden = {
      idTicket: 'VTX-' + Math.floor(100000 + Math.random() * 900000),
      fecha: new Date().toLocaleDateString(),
      items: this.carrito(),
      total: this.carrito().reduce((sum, p) => sum + p.precio, 0),
      metodo: metodoPago
    };

    this.comprasRealizadas.set([orden, ...this.comprasRealizadas()]);
    this.carrito.set([]); // Vaciamos el carrito tras pagar
    return orden;
  }

  // TARJETA GUARDADA
  tarjetaGuardada = signal<any>({
    numero: '•••• •••• •••• 4242',
    titular: 'Itzel Rodríguez',
    exp: '12/28',
    cvv: '123',
    banco: 'BBVA / Fictitious Bank'
  });

  guardarTarjeta(nuevaTarjeta: any) {
    this.tarjetaGuardada.set(nuevaTarjeta);
  }
}