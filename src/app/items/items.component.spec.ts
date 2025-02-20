import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ItemsComponent } from './items.component';
import { SocketService } from '../services/socket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ItemsComponent', () => {
  let component: ItemsComponent;
  let fixture: ComponentFixture<ItemsComponent>;
  let socketServiceSpy: jasmine.SpyObj<SocketService>;
  let snackbarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    socketServiceSpy = jasmine.createSpyObj('SocketService', [
      'onItemCreated',
      'onTyping',
      'getAllItems',
      'createItem',
      'remove',
      'typing',
    ]);
    snackbarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    snackbarSpy.open.and.stub(); // Ensure it’s properly stubbed

    socketServiceSpy.onItemCreated.and.returnValue(
      of({ id: '1', item_name: 'Test', description: 'Test description' })
    );
    socketServiceSpy.onTyping.and.returnValue(
      of({ userId: '123', typing: true, username: 'User1' })
    );
    socketServiceSpy.getAllItems.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [
        ItemsComponent,
        MatCardModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        CommonModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        NoopAnimationsModule,
      ],
      // declarations: [ItemsComponent],
      providers: [
        FormBuilder,
        { provide: SocketService, useValue: socketServiceSpy },
        { provide: MatSnackBar, useValue: snackbarSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.itemsForm.value).toEqual({
      item_name: '',
      description: '',
    });
  });

  it('should call getItems on initialization', () => {
    expect(socketServiceSpy.getAllItems).toHaveBeenCalled();
  });

  it('should validate form fields', () => {
    component.itemsForm.controls['item_name'].setValue('');
    component.itemsForm.controls['description'].setValue('');
    expect(component.itemsForm.valid).toBeFalse();

    component.itemsForm.controls['item_name'].setValue('Test Item');
    component.itemsForm.controls['description'].setValue('Test Description');
    expect(component.itemsForm.valid).toBeTrue();
  });

  it('should submit form when valid', () => {
    component.itemsForm.controls['item_name'].setValue('Test Item');
    component.itemsForm.controls['description'].setValue('Test Description');
    component.onSubmit();

    expect(socketServiceSpy.createItem).toHaveBeenCalledWith({
      item_name: 'Test Item',
      description: 'Test Description',
    });
  });

  it('should delete an item', () => {
    component.delete('1');
    expect(socketServiceSpy.remove).toHaveBeenCalledWith('1');
    // expect(snackbarSpy.open).toHaveBeenCalledWith(
    //   'Item deleted successfully',
    //   'Close',
    //   { duration: 3000 }
    // );
    expect(socketServiceSpy.getAllItems).toHaveBeenCalled();
  });

  it('should handle typing event', () => {
    component.onTyping();
    expect(socketServiceSpy.typing).toHaveBeenCalledWith(true);
  });
});
