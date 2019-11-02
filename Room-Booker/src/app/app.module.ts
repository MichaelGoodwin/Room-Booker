import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Third-party resources
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// App resources
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AlertsComponent } from './alerts/alerts.component';
import { LoginFormComponent } from './forms/login-form/login-form.component';
import { RegisterFormComponent } from './forms/register-form/register-form.component';

// Views
import { HomeComponent } from './views/home/home.component';

// Providers
import { AuthGuard } from './auth/auth.guard';
import { LoggedInAuthGuard } from './auth/logged-in-auth.guard';

@NgModule({
  declarations: [
    AppComponent,

    // Global components
    NavbarComponent,
    AlertsComponent,
    LoginFormComponent,
    RegisterFormComponent,

    // Views
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthGuard,
    LoggedInAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
