import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor:HttpInterceptorFn=(req,next)=>{
 const token=localStorage.getItem('orientec.jwt');
 const router=inject(Router);
 const outgoing=req.clone({withCredentials:true,...(token?{setHeaders:{Authorization:`Bearer ${token}`}}:{})});
 return next(outgoing).pipe(catchError(err=>{
   const isLogout=req.url.endsWith('/api/v1/auth/logout');
   if(err.status===401 && token && !isLogout){localStorage.removeItem('orientec.jwt');router.navigateByUrl('/login');}
   return throwError(()=>err);
 }));
};
