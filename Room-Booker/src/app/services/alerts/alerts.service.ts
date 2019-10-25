import { Injectable, Input } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Alert } from './alert';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

// Default timeout (in seconds) if no value specified
const DEFAULT_TIMEOUT = 5;

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  _notifications = new BehaviorSubject<Alert[]>([]);
  _messages = new BehaviorSubject<Alert[]>([]);

  private notifications: Alert[] = [];
  private messages: Alert[] = [];

  constructor(router: Router) {
    // Reset all alerts upon trying to navigate to a new page
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.notifications.length = 0;
        this.messages.length = 0;
      }
    });
  }

  /**
   * Remove the alert from the specified array if it exists, matching both message and type.
   * @param a Array to check for alert
   * @param n The {@link Alert} to remove
   */
  private removeAlertFromArrayIfExists(a: Alert[], n: Alert) {
    for (let idx = 0; idx < a.length; idx++) {
      const note: Alert = a[idx];
      if (note.message === n.message && note.type === n.type) {
        a.splice(idx, 1);
        return;
      }
    }
  }

  /**
   * Adds a {@link Alert} to the specified array if it doesn't already exist. Checks message and type
   * @param a Array to add the {@link Alert} to
   * @param n The {@link Alert} to add
   * @param t timeout period (in milliseconds)
   */
  private addAlertToArray(a: Alert[], n: Alert, t: number) {
    // Check for duplicate alert message, if found don't add
    let found = false;
    a.forEach((o) => {
      if (o.message === n.message && o.type === n.type) {
        found = true;
        return;
      }
    });

    // Do not add the message, it already exists.
    if (found) {
      return;
    }

    a.push(n);

    // Auto Remove after timeout period. 0 milliseconds=No auto removal.
    if (t !== 0) {
      setTimeout(() => {
        this.removeAlertFromArrayIfExists(a, n);
      }, t);
    }
  }

  /**
   * Add the alert to the queue of displayed notifications if it doesn't already exist
   * Notifications are displayed in the top-right of the screen
   * @param alert the {@link Alert} to add
   * @param timeout Time (in seconds) before it auto dismisses. 0 will require the user to manually clear the alert
   */
  public addNotification(alert: Alert, timeout: number = DEFAULT_TIMEOUT) {
    this.addAlertToArray(this.notifications, alert, timeout * 1000);
    this._notifications.next(this.notifications);
  }

  /**
   * Removes the alert from queue of displayed notifications if it exists
   * Notifications are displayed in the top-right of the screen
   * @param alert the {@link Alert} to remove
   */
  public removeNotification(alert: Alert) {
    this.removeAlertFromArrayIfExists(this.notifications, alert);
    this._notifications.next(this.notifications);
  }

  /**
   * Add the alert to the queue of displayed messages if it doesn't already exist.
   * Messages are displayed in the center of the screen.
   * @param alert the {@link Alert} to add
   * @param timeout Time (in seconds) before it auto dismisses. 0 will require the user to manually clear the alert
   */
  public addMessage(alert: Alert, timeout: number = DEFAULT_TIMEOUT) {
    this.addAlertToArray(this.messages, alert, timeout * 1000);
    this._messages.next(this.messages);
  }

  /**
   * Removes the alert from queue of displayed messages if it exists
   * Messages are displayed in the center of the screen
   * @param alert the {@link Alert} to remove
   */
  public removeMessage(alert: Alert) {
    this.removeAlertFromArrayIfExists(this.messages, alert);
    this._messages.next(this.messages);
  }
}
