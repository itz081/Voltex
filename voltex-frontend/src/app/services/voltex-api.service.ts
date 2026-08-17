import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VoltexApiService {
  private apiUrl = 'http://localhost:3000/api'; // Puerto de tu backend de NestJS

  constructor(private http: HttpClient) {}

  // Obtener productos de MySQL
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productos`);
  }

  // Crear un producto nuevo en MySQL
  crearProducto(producto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/productos`, producto);
  }

  login(credentials: { email: string; password?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  // Eliminar producto de MySQL
  eliminarProducto(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/productos/eliminar/${id}`, {});
  }

  actualizarProducto(id: number, producto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/productos/actualizar/${id}`, producto);
  }

  // Obtener todas las notificaciones push desde el backend
  getNotificaciones(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/notifications`);
  }

  // Enviar / Programar una nueva notificación push a la BD
  enviarNotificacion(notif: { titulo: string; mensaje: string; horaProgramada: string; tipo: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/notifications`, notif);
  }

  getOrdenesPorUsuario(email: string) {
  return this.http.get(`${this.apiUrl}/ordenes/usuario/${email}`); // <-- Cambiado a 'apiUrl'
  }   

  // Obtener un producto específico por su ID
  getProductoPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/productos/${id}`);
  }
  
}