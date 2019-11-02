import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  form: FormGroup;
  // Prevent duplicates while trying to login
  processing = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required
      ]]
    });
  }

  get fControls() {
    return this.form.controls;
  }

  login = function() {
    if (!this.form.valid) {
      // Mark all forms as touched to ensure validation happens on submit
      Object.keys(this.form.controls).forEach(f => {
        const c = this.form.get(f);
        c.markAsTouched({ onlySelf: true });
      });

      return;
    }

    this.processing = true;
    this.authService.login(this.form.value)
      .then(() => this.processing = false);
  };

}
