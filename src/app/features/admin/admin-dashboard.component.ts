import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ADMIN_RESOURCE_GROUPS } from './admin-resources';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="shell">
      <header><b>ORIENTEC / ADMINISTRAÇÃO</b><a routerLink="/">Início</a></header>
      <main>
        <div class="title">
          <div>
            <h2>Administração</h2>
            <p class="hint">Gerencie cadastros e operações disponíveis para sua conta.</p>
          </div>
        </div>
        <section class="panel admin-group" *ngFor="let group of groups">
          <h3>{{group.label}}</h3>
          <div class="admin-links">
            <a class="admin-link" *ngFor="let resource of group.resources" [routerLink]="['/admin', resource.key]">
              {{resource.label}} <span aria-hidden="true">›</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  `
})
export class AdminDashboardComponent {
  readonly groups = ADMIN_RESOURCE_GROUPS;
}
