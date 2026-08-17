import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-filters.component.html',
  styleUrl: './sidebar-filters.component.css',
})
export class SidebarFiltersComponent implements OnInit {
  [x: string]: any;

  // Emisor de eventos para mandar los filtros activos al componente principal
  @Output() filtrosChange = new EventEmitter<any>();

  // Listas que vendrán directamente de tu base de datos / API
  tiposCompresor: string[] = [];
  entregasPotencia: string[] = [];
  conexionesMecanicas: string[] = [];
  espaciosRequeridos: string[] = [];

  // Objeto para registrar las selecciones del usuario
  filtrosSeleccionados = {
    tipo: [] as string[],
    potencia: [] as string[],
    conexion: [] as string[],
    espacio: [] as string[]
  };

  ngOnInit() {
    this.cargarFiltrosDesdeBD();
  }

  cargarFiltrosDesdeBD() {
    // Aquí conectarás tu servicio que extrae los datos de la BD de 7VOLTEX
    this.tiposCompresor = [
      'Centrífugos Pro-Mod / Outlaw', 
      'Roots de Alta Eficiencia', 
      'Twin-Screw de Grado de Carreras'
    ];
    this.entregasPotencia = [
      'Instantánea desde 0 RPM', 
      'Lineal / Progresiva'
    ];
    this.conexionesMecanicas = [
      'Correa Dentada (Cog Belt)', 
      'Engranaje Directo (Gear Drive)'
    ];
    this.espaciosRequeridos = [
      'Interno (Cierra capó original)', 
      'Externo (Cortar capó)'
    ];
  }

  onFiltroChange(categoria: string, valor: string, event: any) {
    const isChecked = event.target.checked;
    
if (!this.filtrosSeleccionados[categoria as keyof typeof this.filtrosSeleccionados]) {
  // Control de respaldo dinámico usando tu indexador [x: string]
      // Control de respaldo dinámico usando tu indexador [x: string]
    }

    if (isChecked) {
      this.filtrosSeleccionados[categoria as keyof typeof this.filtrosSeleccionados].push(valor);
    } else {
      this.filtrosSeleccionados[categoria as keyof typeof this.filtrosSeleccionados] = 
        this.filtrosSeleccionados[categoria as keyof typeof this.filtrosSeleccionados].filter(item => item !== valor);
    }

    this.filtrosChange.emit(this.filtrosSeleccionados);
  }
}