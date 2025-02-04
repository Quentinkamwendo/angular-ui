import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { AccountService } from '../../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrl: './new.component.css',
})
export class NewComponent implements OnInit {
  newForm!: FormGroup;
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
    this.newForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    if (this.id) {
      this.title = 'Edit User';
      this.accountService.getUser(this.id).pipe(first()).subscribe({
        next: (user) => {
          this.newForm.patchValue(user);
        },
      });
    }
  }

  onSubmit() {
    if (this.newForm.valid) {
      this.isLoading = true;
      if (this.id) {
        this.accountService
          .updateUser(this.id, this.newForm.value)
          .pipe(first())
          .subscribe({
            next: () => {
              this.newForm.reset();
              this.snackbar.open('User updated successfully', 'Close', {
                duration: 3000,
              });
              this.router.navigateByUrl('/');
            },
          });
      } else {
        this.accountService
          .register(this.newForm.value)
          .pipe(first())
          .subscribe({
            next: () => {
              this.newForm.reset();
              this.snackbar.open('Registered successfully', 'Close', {
                duration: 3000,
              });
              this.router.navigateByUrl('/');
            },
          });
      }
    }
  }
}
