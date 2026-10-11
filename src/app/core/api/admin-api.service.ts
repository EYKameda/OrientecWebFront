import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AdminResource } from '../../features/admin/admin-resources';

export interface AdminPage {
  content: Record<string, unknown>[];
  totalElements: number;
  totalPages: number;
  page: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);

  listar(resource: AdminResource, page: number, size: number): Observable<AdminPage> {
    let params = new HttpParams();
    if (resource.paginated !== false) {
      params = params.set('page', page).set('size', size).set('sort', resource.sort ?? 'id,asc');
    }
    return this.http.get<unknown>(resource.endpoint, { params }).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return {
            content: response.map(this.toRecord),
            totalElements: response.length,
            totalPages: response.length ? 1 : 0,
            page: 0
          };
        }
        if (!isRecord(response) || !Array.isArray(response['content'])) {
          throw new Error('O backend retornou um formato de lista inesperado.');
        }
        return {
          content: response['content'].map(this.toRecord),
          totalElements: Number(response['totalElements'] ?? response['content'].length),
          totalPages: Number(response['totalPages'] ?? 1),
          page: Number(response['page'] ?? page)
        };
      })
    );
  }

  buscar(resource: AdminResource, id: string | number): Observable<Record<string, unknown>> {
    return this.http.get<unknown>(`${resource.endpoint}/${encodeURIComponent(String(id))}`).pipe(
      map(response => {
        if (!isRecord(response)) {
          throw new Error('O backend retornou um registro em formato inesperado.');
        }
        return response;
      })
    );
  }

  criar(resource: AdminResource, body: Record<string, unknown>): Observable<unknown> {
    return this.http.post<unknown>(resource.endpoint, body);
  }

  atualizar(resource: AdminResource, id: string | number, body: Record<string, unknown>): Observable<unknown> {
    return this.http.put<unknown>(`${resource.endpoint}/${encodeURIComponent(String(id))}`, body);
  }

  excluir(resource: AdminResource, id: string | number): Observable<unknown> {
    return this.http.delete<unknown>(`${resource.endpoint}/${encodeURIComponent(String(id))}`);
  }

  private toRecord(value: unknown): Record<string, unknown> {
    if (!isRecord(value)) {
      throw new Error('O backend retornou um registro em formato inesperado.');
    }
    return value;
  }
}
