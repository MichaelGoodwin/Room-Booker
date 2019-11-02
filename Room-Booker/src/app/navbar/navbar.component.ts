import { Component, OnInit } from '@angular/core';
import { faSignInAlt, faSignOutAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  // Icons
  faSignIn = faSignInAlt;
  faSignOut = faSignOutAlt;
  faNewUser = faUserPlus;

  constructor(private authService: AuthService) { }

  ngOnInit() { }

  logout() {
    this.authService.logout();
  }

  get isLoggedIn() {
    return this.authService.hasUser();
  }
}
