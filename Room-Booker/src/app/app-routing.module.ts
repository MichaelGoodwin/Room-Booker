import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Views
import { HomeComponent } from './views/home/home.component';

const routes: Routes = [
  {path: '', component: HomeComponent},

  // Catch-all redirect to main page
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
