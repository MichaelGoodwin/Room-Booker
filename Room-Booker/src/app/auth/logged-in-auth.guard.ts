import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AlertsService } from 'src/app/alerts/alerts.service';
import { ErrorMessage } from 'src/app/messages';

@Injectable({
  providedIn: 'root'
})
/**
 * Prevents access to a route if the user is already logged in
 */
export class LoggedInAuthGuard implements CanActivate {
  constructor(private alerts: AlertsService, private authService: AuthService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.isLoggedIn(state.url);
  }

  async isLoggedIn(url: string): Promise<boolean> {
    try {
      const resp = await this.authService.isLoggedIn();
      if (resp) {
        this.router.navigate(['']);
        this.alerts.addMessage(ErrorMessage.ALREADY_LOGGED_IN);
        return false;
      }

      return true;
    } catch (err) {
      this.alerts.addMessage(ErrorMessage.CONNECTION_ERROR);
      console.log(err);
      return false;
    }
  }
}
