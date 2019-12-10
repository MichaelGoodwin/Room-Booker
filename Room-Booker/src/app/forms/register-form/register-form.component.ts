import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ErrorMessage, SuccessMessage } from 'src/app/messages';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertsService } from 'src/app/alerts/alerts.service';
import { ApiResponse } from 'src/app/services/api/ApiResponse';
import { Alert } from 'src/app/alerts/alert';
import { AlertType } from 'src/app/alerts/alert-type';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  processing = false; // Helps Prevent duplicate submits while waiting on promise

  constructor(
    private formBuilder: FormBuilder,
    private alertsService: AlertsService,
    private http: HttpClient,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(16)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(255),
      ]],
      confirmPassword: ['', [
        Validators.required
      ]],
    }, {
      validator: this.MustMatch('password', 'confirmPassword')
    });
  }

  get fControls() {
    return this.form.controls;
  }

  register() {
    this.submitted = true;

    if (!this.form.valid) {
      // Mark all forms as touched to ensure validation happens on submit
      Object.keys(this.form.controls).forEach(f => {
        const c = this.form.get(f);
        c.markAsTouched({ onlySelf: true });
      });

      return;
    }

    this.processing = true;

    const promise = this.http.post('/api/register', this.form.value);
    promise.subscribe((response: ApiResponse) => {
      this.processing = false;

      if (response.message) {
        const notification = new Alert(response.message, AlertType.SUCCESS);
        this.alertsService.addMessage(notification);
      }

      if (response.success) {
        this.router.navigate(['login']);
        this.alertsService.addMessage(SuccessMessage.ACCOUNT_CREATED);
        return;
      }

      const errs = response.errors;
      if (errs) {
        for (const error of errs) {
          const form = this.form.get(error);
          if (form) {
            form.setErrors({ taken: true });
          }
        }
      }
    },
    err => {
      this.alertsService.addMessage(ErrorMessage.CONNECTION_ERROR);
      this.processing = false;
      console.warn(err);
    });
  }

  /**
   * Custom form validator that ensures the `otherControlName` {@link FormControl} value matches the `controlName` {@link FormControl} value
   * @param controlName The {@link FormControl} to compare against
   * @param otherControlName The {@link FormControl} that should receive the `mustMatch` error if values don't match
   */
  MustMatch(controlName: string, otherControlName: string) {
    return (formGroup: FormGroup) => {
      const c = formGroup.controls[controlName];
      const c2 = formGroup.controls[otherControlName];

      // Only run this validation if all other validations pass
      if (c2.errors && !c2.errors.mustMatch) {
        return;
      }

      if (c.value !== c2.value) {
        c2.setErrors({ mustMatch: true });
      } else {
        c2.setErrors(null);
      }
    };
  }
}
