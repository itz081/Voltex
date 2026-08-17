import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { TheNavbarComponent } from './components/the-navbar/the-navbar.component';
import { TheFooterComponent } from './components/the-footer/the-footer.component';
import { WatchNotificationComponent } from "./components/watch-notification/watch-notification.component";
import { Router } from '@angular/router';
import { VoltexStateService } from './services/voltex-state';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    TheNavbarComponent,
    TheFooterComponent,
    WatchNotificationComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  constructor(
    public state: VoltexStateService,
    public router: Router // <-- Listo como public para usarlo en el HTML
  ) {}

  cerrarSesion() {
    this.state.usuarioActual.set(null);
    this.router.navigate(['/login']);
  }
}