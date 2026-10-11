import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

interface LoginResponse { accessToken:string; sessionId:string; expiresAt:string; }
@Injectable({providedIn:'root'})
export class AuthService {
 private http=inject(HttpClient); private router=inject(Router); private key='orientec.jwt';
 login(login:string,senha:string):Observable<LoginResponse>{return this.http.post<LoginResponse>('/api/v1/auth/login',{login,senha},{withCredentials:true}).pipe(tap(r=>localStorage.setItem(this.key,r.accessToken)));}
 token(){return localStorage.getItem(this.key);}
 logout(){const token=this.token(); localStorage.removeItem(this.key); if(token) this.http.post('/api/v1/auth/logout',{}, {withCredentials:true}).subscribe({complete:()=>this.router.navigateByUrl('/login'),error:()=>this.router.navigateByUrl('/login')}); else this.router.navigateByUrl('/login');}
 isAuthenticated(){return !!this.token();}
 permissions():string[]{const t=this.token(); if(!t)return []; try{const p=JSON.parse(atob(t.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));return Array.isArray(p.permissoes)?p.permissoes:[];}catch{return [];}}
 sedeCodigo():number|null{const t=this.token();if(!t)return null;try{const p=JSON.parse(atob(t.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));return p.sedeCodigo??null;}catch{return null;}}
 has(p:string){return this.permissions().includes(p);}
}
