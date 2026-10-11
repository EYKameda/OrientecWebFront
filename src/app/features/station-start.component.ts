import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StationService } from '../core/auth/station.service';
import { switchMap, of } from 'rxjs';

@Component({standalone:true,template:`<main class="login"><section class="card"><h1>ORIENTEC</h1><p>{{mensagem}}</p></section></main>`})
export class StationStartComponent {
  private route=inject(ActivatedRoute); private router=inject(Router); private station=inject(StationService); mensagem='Autorizando esta estação...';
  ngOnInit(){const code=this.route.snapshot.queryParamMap.get('code'); if(!code){this.mensagem='Código de inicialização ausente.';return;}
    this.station.exchange(code).pipe(switchMap(()=>this.station.authorized())).subscribe({next:()=>this.router.navigateByUrl('/login'),error:e=>{this.mensagem=e?.error?.detail??'Não foi possível autorizar esta estação.';}});
  }
}
