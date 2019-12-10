import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertsService } from 'src/app/alerts/alerts.service';
import { Router } from '@angular/router';
import { ApiResponse } from 'src/app/services/api/ApiResponse';
import { ErrorMessage, SuccessMessage } from 'src/app/messages';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // The server uses passport to handle authentication for all API requests so we want to ask the server
  // if we are logged in on every new page request as well. To minimize API calls we store the user here
  // for less critical logged-in checks such as the login/logout html elements
  user: any;

  // redirect to this URL after logging in, used for redirecting to previous page when applicable
  redirectUrl: string;

  constructor(private alertService: AlertsService, private http: HttpClient, private router: Router) { }

  async login(data: any): Promise<boolean> {
    try {
      const response = await this.http.post<ApiResponse>('/api/login', data).toPromise();

      let message = ErrorMessage.LOGIN;

      if (response.success) {
        message = SuccessMessage.LOGGED_IN;
        const target = this.redirectUrl === undefined ? 'dashboard' : this.redirectUrl;
        console.log(target);
        this.router.navigate([target]);
        this.redirectUrl = undefined;
      }

      this.alertService.addMessage(message);
      return response.success;
    } catch (err) {
      this.alertService.addMessage(ErrorMessage.CONNECTION_ERROR);
      console.log(err);
      return false;
    }
  }

  async logout() {
    try {
      await this.http.post('/api/logout', {}).toPromise();
    } catch (err) {
      this.alertService.addMessage(ErrorMessage.CONNECTION_ERROR);
      console.log(err);
      return;
    }

    this.user = undefined;
    this.router.navigate(['/login']);

    this.alertService.addMessage(SuccessMessage.LOGGED_OUT);
    return;
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const response = await this.http.get('/api/loggedin').toPromise();
      if (response === false) {
        return false;
      }

      this.user = response;
      return true;
    } catch (err) {
      console.log('Error checking if API logged in');
      console.log(err);
      this.user = undefined;
      return false;
    }
  }

  hasUser(): boolean {
    return this.user !== undefined;
  }
}
