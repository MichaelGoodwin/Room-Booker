import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Third-party resources
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// App resources
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
