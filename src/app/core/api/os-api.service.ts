import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface OsStatus { id:number; codigo:string; descricao:string; ativo:boolean; }
export interface OrdemServico {
  id:number;
  situacao:{id:number;codigo:string;descricao:string};
  clienteId?:number;
  equipamentoModeloId?:number;
  defeitoRelatado?:string;
  observacao?:string;
  agaurPecas?:boolean;
  aguardaPecas?:boolean;
  aguardaFotos?:boolean;
  aguardaNota?:boolean;
}
export interface OsAcao {
  tipo:string; destinoId:number; destinoCodigo:string; destinoDescricao:string;
  permitida:boolean; exigeAutorizacao:boolean; permissaoExecucao?:string;
  permissaoAutorizacao?:string; exigeOutroUsuario:boolean; metodoAutorizacao:string; mensagem:string;
}

@Injectable({providedIn:'root'})
export class OsApiService {
  private http=inject(HttpClient);

  listar(page=0, size=20, sort='id,asc', statusId?:number, clienteId?:number): Observable<PageResult<OrdemServico>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);
    if (statusId != null) params = params.set('statusId', statusId);
    if (clienteId != null) params = params.set('clienteId', clienteId);
    return this.http.get<PageResult<OrdemServico>>('/api/v1/os', {params});
  }

  buscar(id:number){return this.http.get<OrdemServico>(`/api/v1/os/${id}`);}
  acoes(id:number){return this.http.get<OsAcao[]>(`/api/v1/os/${id}/acoes`);}
  transicionar(id:number,destino:number,body:{autorizadorCodigo?:number;senhaAutorizador?:string;justificativa:string}){
    return this.http.post<void>(`/api/v1/os/${id}/transicoes/${destino}`,body,{headers:{'Idempotency-Key':crypto.randomUUID()}});
  }
}
