import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { LoginComponent } from './features/login/login.component';
import { StationStartComponent } from './features/station-start.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { OsListComponent } from './features/os/os-list.component';
import { OsDetailComponent } from './features/os/os-detail.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';
import { AdminCrudComponent } from './features/admin/admin-crud.component';
export const routes: Routes = [
 {path:'station/start',component:StationStartComponent},
 {path:'login',component:LoginComponent},
 {path:'',canActivate:[authGuard],component:DashboardComponent},
 {path:'os',canActivate:[authGuard],component:OsListComponent},
 {path:'os/:id',canActivate:[authGuard],component:OsDetailComponent},
 {path:'admin',canActivate:[authGuard],component:AdminDashboardComponent},
 {path:'admin/:resource',canActivate:[authGuard],component:AdminCrudComponent},
 {path:'**',redirectTo:''}
];
