import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { ErrorMessage } from 'src/app/messages';

@Injectable({
  providedIn: 'root'
})

/**
 * Prevents access to a route if the user is not logged in
 */
export class AuthGuard implements CanActivate {
  constructor(private alerts: AlertsService, private authService: AuthService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.isLoggedIn(state.url);
  }

  async isLoggedIn(url: string): Promise<boolean> {
    try {
      const resp = await this.authService.isLoggedIn();
      if (resp) {
        return true;
      }

      // Save for redirecting after login
      this.authService.redirectUrl = url;

      this.router.navigate(['/login']);
      this.alerts.addMessage(ErrorMessage.LOGGED_IN);
      return false;
    } catch (err) {
      this.alerts.addMessage(ErrorMessage.CONNECTION_ERROR);
      console.log(err);
      return false;
    }
  }
}
