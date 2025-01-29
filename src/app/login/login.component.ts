import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AccountService } from '../services/account.service';
import { first } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.accountService
        .login(this.f['email'].value, this.f['password'].value)
        .pipe(first())
        .subscribe({
          next: () => {
            this.loginForm.reset();
            this.snackbar.open('Logged in successfully', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
            });
            this.router.navigate(['/items']);
          },
          error: (error) => {
            this.snackbar.open(error, 'Close', {
              duration: 3000,
            });
          },
        });
    }
  }
}
