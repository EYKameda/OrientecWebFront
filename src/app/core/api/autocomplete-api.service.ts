import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AutocompleteOption<T = number | string> {
  id: T;
  label: string;
}

export type AutocompleteTipo =
  | 'cliente' | 'fornecedor' | 'credenciado' | 'acessorio' | 'defeito'
  | 'familia' | 'item' | 'linha' | 'marca' | 'modelo' | 'origem-os'
  | 'tipo-garantia' | 'tipo-pendencia' | 'sede' | 'usuario' | 'os-status';

@Injectable({providedIn:'root'})
export class AutocompleteApiService {
  private readonly http = inject(HttpClient);

  buscar(tipo: AutocompleteTipo, texto: string): Observable<AutocompleteOption[]> {
    const params = new HttpParams().set('texto', texto.trim());
    return this.http.get<AutocompleteOption[]>(`/api/v1/autocomplete/${tipo}`, {params});
  }
}
