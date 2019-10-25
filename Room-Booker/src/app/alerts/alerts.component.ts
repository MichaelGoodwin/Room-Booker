import { Component, OnInit } from '@angular/core';
import { AlertsService } from '../services/alerts/alerts.service';
import { Alert } from '../services/alerts/alert';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
  notifications: Observable<Alert[]>;
  messages: Observable<Alert[]>;

  constructor(private alertsService: AlertsService) {
    // Bind to the necessary arrays to watch for changes using async pipe
    this.notifications = alertsService._notifications;
    this.messages = alertsService._messages;
  }

  ngOnInit() {
  }

  removeNotification(alert: Alert) {
    this.alertsService.removeNotification(alert);
  }

  removeMessage(alert: Alert) {
    this.alertsService.removeMessage(alert);
  }
}
