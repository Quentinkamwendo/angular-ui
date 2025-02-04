import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { first } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccountService } from '../services/account.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  // standalone: true, 
})
export class RegisterComponent implements OnInit{
  registerForm!: FormGroup;
  isLoading: boolean = false;
  id?: string;
  title: string = 'Register';

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

  }
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    if (this.id) {
      this.title = 'Edit User';
      this.accountService.getUser(this.id).subscribe({
        next: (user) => {
          this.registerForm.patchValue(user);}
      });
    }

  }


  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      if (this.id) {
        this.accountService
          .updateUser(this.id, this.registerForm.value)
          .pipe(first())
          .subscribe({
            next: () => {
              this.registerForm.reset();
              this.snackbar.open('User updated successfully', 'Close', {
                duration: 3000
              });
              this.router.navigateByUrl('/');
            },
          });
      } else {
        this.accountService
        .register(this.registerForm.value)
        .pipe(first())
        .subscribe({
          next: () => {
            this.registerForm.reset();
            this.snackbar.open('Registered successfully', 'Close', {
              duration: 3000
            });
            this.router.navigateByUrl('/');
          },
        });
      }
      
    }
  }
}
