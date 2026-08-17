export interface Supercargador {
  id: number;
  nombre: string;
  subtitulo: string;
  marca: string;
  precio: number;
  tipoSupercargador: 'Centrífugos Pro-Mod / Outlaw (Los reyes de la velocidad máxima)' | 'Roots de Alta Eficiencia (6-71 al 14-71 y "Screw Blowers")' | 'Twin-Screw (Tornillo Doble) de Grado de Carreras';
  entregaPotencia: 'Instantánea desde 0 RPM' | 'Lineal / Progresiva hacia altas RPM';
  conexionMecanica: 'Correa Dentada de Carreras (Cog Belt)' | 'Engranaje Directo al Cigüeñal (Gear Drive)';
  espacioRequerido: 'Interno (Cierra el capó original)' | 'Externo (Requiere cortar el capó)';
  presionBoost: string;
  modalidad: 'Formula' | 'Drift' | 'Rally' | 'Karting';
  etiqueta: string;
  colorEtiqueta: string;
  imagen: string;
}

export const supercargadoresMock: Supercargador[] = [
  {
    id: 1,
    nombre: 'PROCHARGER F-3X-140',
    subtitulo: 'Centrífugo Pro-Mod / Outlaw Series',
    marca: 'ProCharger',
    precio: 6899,
    tipoSupercargador: 'Centrífugos Pro-Mod / Outlaw (Los reyes de la velocidad máxima)',
    entregaPotencia: 'Lineal / Progresiva hacia altas RPM',
    conexionMecanica: 'Engranaje Directo al Cigüeñal (Gear Drive)',
    espacioRequerido: 'Interno (Cierra el capó original)',
    presionBoost: '50+ PSI',
    modalidad: 'Formula', 
    etiqueta: '3000+ HP READY',
    colorEtiqueta: '#00D4FF', // Cian eléctrico
    imagen: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 2,
    nombre: 'PSI SCREW BLOWER 14-71',
    subtitulo: 'Roots de Alta Eficiencia con Teflón Spec',
    marca: 'PSI Superchargers',
    precio: 8549,
    tipoSupercargador: 'Roots de Alta Eficiencia (6-71 al 14-71 y "Screw Blowers")',
    entregaPotencia: 'Instantánea desde 0 RPM',
    conexionMecanica: 'Correa Dentada de Carreras (Cog Belt)',
    espacioRequerido: 'Externo (Requiere cortar el capó)',
    presionBoost: '35 PSI',
    modalidad: 'Drift', 
    etiqueta: 'TORQUE INSTANTÁNEO',
    colorEtiqueta: '#00FFCC', // Turquesa
    imagen: 'https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 3,
    nombre: 'WHIPPLE GEN 5 STAGE 4',
    subtitulo: 'Twin-Screw de Grado de Carreras de Resistencia',
    marca: 'Whipple',
    precio: 5999,
    tipoSupercargador: 'Twin-Screw (Tornillo Doble) de Grado de Carreras',
    entregaPotencia: 'Instantánea desde 0 RPM',
    conexionMecanica: 'Correa Dentada de Carreras (Cog Belt)',
    espacioRequerido: 'Interno (Cierra el capó original)',
    presionBoost: '25 PSI',
    modalidad: 'Rally', 
    etiqueta: 'CURVA PLANA UX',
    colorEtiqueta: '#b900ff',
    imagen: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=500&auto=format&fit=crop'
  }
];