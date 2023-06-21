import { IsnewGuard } from './guards/isnew.guard';
import { PasschangeComponent } from './passchange/passchange.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminGuard } from './guards/admin.guard';
import { UserListComponent } from './user-list/user-list.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path:"login",component:LoginComponent},
  {path:"newpassword",component:PasschangeComponent,canActivate:[AuthGuard,IsnewGuard]},
  {path:"dashboard",component:DashboardComponent,canActivate: [AuthGuard,IsnewGuard,AdminGuard]},
  {path:"",component:UserListComponent,canActivate: [AuthGuard,IsnewGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
