import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn:'root'})
export class StationService {
  private http=inject(HttpClient);
  authorized():Observable<{authorized:boolean}>{return this.http.get<{authorized:boolean}>('/api/v1/stations/session',{withCredentials:true});}
  exchange(code:string){return this.http.post('/api/v1/stations/exchange',{code},{withCredentials:true});}
}
