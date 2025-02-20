import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewComponent } from './new.component';
import { AccountService } from '../../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('NewComponent', () => {
  let component: NewComponent;
  let fixture: ComponentFixture<NewComponent>;
  let accountServiceSpy: jasmine.SpyObj<AccountService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackbarSpy: jasmine.SpyObj<MatSnackBar>;
  let routeSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    accountServiceSpy = jasmine.createSpyObj('AccountService', ['getUser', 'updateUser', 'register']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    snackbarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    routeSpy = jasmine.createSpyObj('ActivatedRoute', [], { snapshot: { params: {} } });

    await TestBed.configureTestingModule({
      declarations: [NewComponent],
      providers: [
        FormBuilder,
        { provide: AccountService, useValue: accountServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackbarSpy },
        { provide: ActivatedRoute, useValue: routeSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.newForm.value).toEqual({
      username: '',
      email: '',
      password: '',
    });
  });

  it('should validate the form correctly', () => {
    component.newForm.setValue({ username: 'ab', email: 'invalid', password: '123' });
    expect(component.newForm.valid).toBeFalse();

    component.newForm.setValue({ username: 'user123', email: 'user@example.com', password: 'password123' });
    expect(component.newForm.valid).toBeTrue();
  });

  it('should call getUser if an ID is provided', () => {
    routeSpy.snapshot.params['id'] = '123';
    accountServiceSpy.getUser.and.returnValue(of({ username: 'testuser', email: 'test@example.com', password: 'testpass' }));
    component.ngOnInit();
    expect(accountServiceSpy.getUser).toHaveBeenCalledWith('123');
  });

  it('should register a new user', () => {
    accountServiceSpy.register.and.returnValue(of({}));
    component.newForm.setValue({ username: 'newuser', email: 'new@example.com', password: 'password' });
    component.onSubmit();
    expect(accountServiceSpy.register).toHaveBeenCalled();
    expect(snackbarSpy.open).toHaveBeenCalledWith('Registered successfully', 'Close', { duration: 3000 });
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should update an existing user', () => {
    component.id = '123';
    accountServiceSpy.updateUser.and.returnValue(of({}));
    component.newForm.setValue({ username: 'updateduser', email: 'updated@example.com', password: 'newpassword' });
    component.onSubmit();
    expect(accountServiceSpy.updateUser).toHaveBeenCalledWith('123', { username: 'updateduser', email: 'updated@example.com', password: 'newpassword' });
    expect(snackbarSpy.open).toHaveBeenCalledWith('User updated successfully', 'Close', { duration: 3000 });
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
  });
});
