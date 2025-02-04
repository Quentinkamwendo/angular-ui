import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { AccountService } from '../services/account.service';
import { first } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['username', 'email', 'actions'];
  users: User[] = [];

  constructor(private accountService: AccountService, private matSnackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.accountService
      .getAllUsers()
      .pipe(first())
      .subscribe({
        next: (users) => {
          this.users = users;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  editUser(id: string, user: User) {
    this.accountService
      .updateUser(id, user)
      .pipe(first())
      .subscribe({
        next: () => {
          this.getAllUsers();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  deleteUser(id: string) {
    this.accountService
      .deleteUser(id)
      .pipe(first())
      .subscribe({
        next: () => {
          this.matSnackBar.open('User deleted successfully', 'Close', { duration: 3000 });
          this.getAllUsers();
        },
        error: (error) => {
          this.matSnackBar.open('Error deleting user', 'Close', { duration: 3000 });
          console.error(error);
        },
      });
  }
}
