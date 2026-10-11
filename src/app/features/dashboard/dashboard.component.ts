import {Component,inject} from '@angular/core'; import {RouterLink} from '@angular/router'; import {AuthService} from '../../core/auth/auth.service';
@Component({standalone:true,imports:[RouterLink],template:`<div class="shell">
        <header><b>ORIENTEC</b>
            <button (click)="auth.logout()">Sair</button>
        </header>
        <main>
            <div class="grid">
                <a routerLink="/os" class="tile">
                    <strong>Ordens de Serviço</strong>
                    <span>Consultar e operar conforme a matriz cadastrada.</span>
                </a>
                <a routerLink="/admin" class="tile">
                    <strong>Administração</strong>
                    <span>Gerenciar usuários, sedes, cadastros, pedidos e regras.</span>
                </a>
                <div class="tile">
                    <strong>Permissões</strong>
                    <span>{{auth.permissions().length}} permissões carregadas.</span>
                </div>
            </div>
        </main>
    </div>`}) export class DashboardComponent{auth=inject(AuthService);}
