import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OsApiService, OrdemServico } from '../../core/api/os-api.service';
import { AutocompleteComponent } from '../../shared/autocomplete/autocomplete.component';
import { AutocompleteOption } from '../../core/api/autocomplete-api.service';

@Component({
  standalone:true,
  imports:[CommonModule,RouterLink,AutocompleteComponent],
  template:`
    <div class="shell">
      <header><b>ORIENTEC / OS</b><a routerLink="/">Início</a></header>
      <main>
        <div class="title">
          <h2>Ordens de Serviço</h2>
          <button type="button" (click)="recarregar()" [disabled]="carregando">Atualizar</button>
        </div>
        <div class="filters">
          <label>Cliente
            <orientec-autocomplete
              tipo="cliente"
              placeholder="Digite ao menos 2 caracteres..."
              [minChars]="2"
              [debounceMs]="300"
              (selected)="selecionarCliente($event)">
            </orientec-autocomplete>
          </label>
          <button type="button" *ngIf="clienteSelecionado" (click)="limparCliente()">Limpar filtro</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>OS</th><th>Situação</th><th>Cliente</th><th></th></tr></thead>
            <tbody>
              <tr *ngFor="let os of lista; trackBy: trackById">
                <td>{{os.id}}</td>
                <td><span class="status">{{os.situacao.descricao}}</span></td>
                <td>{{os.clienteId||'-'}}</td>
                <td><a [routerLink]="['/os',os.id]">Abrir</a></td>
              </tr>
              <tr *ngIf="carregando"><td colspan="4">Carregando...</td></tr>
              <tr *ngIf="!carregando && !lista.length"><td colspan="4">Nenhuma OS encontrada.</td></tr>
            </tbody>
          </table>
        </div>
        <div #sentinela class="scroll-sentinel" aria-hidden="true"></div>
        <div class="scroll-info" *ngIf="!carregando && lista.length">
          {{lista.length}} de {{totalElementos}} registros
          <span *ngIf="!temMais"> — fim da lista</span>
        </div>
      </main>
    </div>
  `
})
export class OsListComponent implements AfterViewInit, OnDestroy {
  private readonly api = inject(OsApiService);
  private readonly cdr = inject(ChangeDetectorRef);
  @ViewChild('sentinela') private sentinela?:ElementRef<HTMLElement>;
  private observer?:IntersectionObserver;
  lista:OrdemServico[]=[];
  page=0;
  readonly size=20;
  totalElementos=0;
  temMais=true;
  carregando=false;
  clienteSelecionado?: AutocompleteOption;

  ngAfterViewInit() {
  this.observer = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) {
      this.carregarProximaPagina();
    }
  }, {
    root: null,
    rootMargin: '400px 0px',
    threshold: 0
  });

  if (this.sentinela) {
    this.observer.observe(this.sentinela.nativeElement);
  }

  queueMicrotask(() => {
    this.carregarProximaPagina();
    this.cdr.detectChanges();
  });
}
  ngOnDestroy(){this.observer?.disconnect();}
  recarregar(){this.lista=[];this.page=0;this.totalElementos=0;this.temMais=true;this.carregando=false;this.carregarProximaPagina();}
  selecionarCliente(opcao:AutocompleteOption){this.clienteSelecionado=opcao;this.recarregar();}
  limparCliente(){this.clienteSelecionado=undefined;this.recarregar();}
  carregarProximaPagina(){
    if(this.carregando || !this.temMais) return;
    this.carregando=true;
    this.api.listar(this.page,this.size,'id,asc',undefined,this.clienteSelecionado?.id as number|undefined).subscribe({
      next:r=>{this.lista.push(...r.content);this.totalElementos=r.totalElements;this.page=r.page+1;this.temMais=this.page<r.totalPages && r.content.length>0;this.carregando=false;},
      error:()=>{this.carregando=false;}
    });
  }
  trackById(_:number,os:OrdemServico){return os.id;}
}
