import { Component, OnInit } from '@angular/core';
import { faSignInAlt, faSignOutAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';

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

  // TODO: Update to be based on the Auth Service logged in state
  isLoggedIn: false;

  constructor() { }

  ngOnInit() { }
}
