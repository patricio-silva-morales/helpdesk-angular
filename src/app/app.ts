import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink, RouterLinkActive,
    MatToolbarModule, MatSidenavModule,
    MatIconModule, MatButtonModule,
    MatListModule  
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('help-desk');
}
