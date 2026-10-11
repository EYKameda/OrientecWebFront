import {Injectable,inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
export type CanalComunicacao='WHATSAPP'|'SMS'|'EMAIL';
export interface ComunicacaoRequest{ordemServicoId:number;orcamentoId?:number;canal:CanalComunicacao;assunto?:string;mensagem:string;}
export interface Comunicacao{ id:number; ordemServicoId:number; orcamentoId?:number; clienteId:number; canal:CanalComunicacao; status:'SOLICITADO'|'ENVIADO'|'ENTREGUE'|'FALHA'; dataHora:string; dataHoraEnvio?:string; destinatario:string; assunto?:string; mensagem:string; usuarioCodigo:number; erro?:string; }
@Injectable({providedIn:'root'}) export class ComunicacaoApiService{
 private http=inject(HttpClient);
 enviar(req:ComunicacaoRequest):Observable<Comunicacao>{return this.http.post<Comunicacao>('/api/v1/comunicacoes/enviar',req);}
 listarOs(osId:number):Observable<Comunicacao[]>{return this.http.get<Comunicacao[]>(`/api/v1/comunicacoes/os/${osId}`);}
 listarOrcamento(id:number):Observable<Comunicacao[]>{return this.http.get<Comunicacao[]>(`/api/v1/comunicacoes/orcamento/${id}`);}
}
