import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = 'Email: firas.s.main1@gmail.com';
  password: string = 'Password: 123456789';
  email1: string = 'Email: ahmad.mansoor@jstest.com';
  password1: string = 'Password: 123456789';
  email2: string = 'Email: fatima.haddad@jstest.com';
  password2: string = 'Password: 123456789';
  form!: FormGroup;
  isLogging = false;
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    this.login();
  }

  login() {
    this.isLogging = true;

    this.authService
      .signIn(this.form.value.email, this.form.value.password)
      .then((user) => {
        return this.authService.saveUserInfoToLocalStorage(user);
      })
      .then(() => {
        this.router.navigate(['/layout']);
      })
      .catch((error: any) => {
        this.form.reset();
        this.isLogging = false;

        if (error.code === 'auth/invalid-login-credentials') {
          this.snackBar.open(
            'Invalid email or password. Please try again.',
            'OK',
            {
              duration: 5000,
            }
          );
        } else {
          console.error('Login error:', error);
          this.snackBar.open('Login failed. Please try again.', 'OK', {
            duration: 5000,
          });
        }
      });
  }
}
