'use strict';
// tslint:disable:max-line-length
import { Alert } from './services/alerts/alert';
import { AlertType } from './services/alerts/alert-type';

export class ErrorMessage {
  static readonly CONNECTION_ERROR: Alert = new Alert('Error communicating with the server, please try again', AlertType.DANGER);
  static readonly ALREADY_LOGGED_IN: Alert = new Alert('You are already logged in', AlertType.DANGER);
  static readonly LOGGED_IN: Alert = new Alert('You must be logged in to access this', AlertType.DANGER);
  static readonly LOGIN: Alert = new Alert('Invalid username or password', AlertType.DANGER);
  static readonly USERNAME_TAKEN: Alert = new Alert('This username  is already taken', AlertType.DANGER);
  static readonly EMAIL_TAKEN: Alert = new Alert('This email already has an account registered to it', AlertType.DANGER);
}

export class SuccessMessage {
  static readonly LOGGED_IN: Alert = new Alert('You have successfully logged in, Welcome!', AlertType.SUCCESS);
  static readonly LOGGED_OUT: Alert = new Alert('You have successfully logged out, come back soon!', AlertType.SUCCESS);
  static readonly ACCOUNT_CREATED: Alert = new Alert('Account created! Welcome to Room Booker!', AlertType.SUCCESS);
}
