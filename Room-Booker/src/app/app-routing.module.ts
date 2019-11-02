import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Route Guards
import { AuthGuard } from './auth/auth.guard';
import { LoggedInAuthGuard } from './auth/logged-in-auth.guard';

// Views
import { HomeComponent } from './views/home/home.component';
import { LoginFormComponent } from './forms/login-form/login-form.component';
import { RegisterFormComponent } from './forms/register-form/register-form.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginFormComponent, canActivate: [LoggedInAuthGuard]},
  {path: 'register', component: RegisterFormComponent, canActivate: [LoggedInAuthGuard]},
  {path: 'dashboard', component: HomeComponent, canActivate: [AuthGuard]},

  // Catch-all redirect to main page
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
