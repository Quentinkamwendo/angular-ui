import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SocketService } from '../services/socket.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css',
})
export class ItemsComponent implements OnInit {
  itemsForm!: FormGroup;
  items: any[] = [];
  isTyping = false;
  typingUserId: string | null = null;
  username: string | null = null;

  constructor(
    private socketService: SocketService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar
  ) {
    this.itemsForm = this.fb.group({
      item_name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getItems();

    this.socketService.onItemCreated().subscribe((item) => {
      this.items.push(item);
    });

    this.socketService.onTyping().subscribe((data) => {
      this.typingUserId = data.userId;
      this.isTyping = data.typing;
      this.username = data.username;
    });
  }

  getItems() {
    this.socketService.getAllItems().subscribe((items) => {
      this.items = items;
    });
  }

  onSubmit() {
    if (this.itemsForm.valid) {
      const newItem = this.itemsForm.value;
      this.socketService.createItem(newItem);
      this.itemsForm.reset();
    }
  }

  delete(id: string) {
    this.socketService.remove(id);
    this.snackbar.open('Item deleted successfully', 'Close', {
      duration: 3000,
    });
    this.socketService.getAllItems().subscribe((items) => {
      this.items = items;
    });
  }

  onTyping() {
    this.socketService.typing(true);
    setTimeout(() => this.socketService.typing(false), 1000);
  }
}
