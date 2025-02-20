import { TestBed } from '@angular/core/testing';
import { AccountService } from './account.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('AccountService', () => {
  let service: AccountService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AccountService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AccountService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store token', () => {
    const dummyResponse = { access_token: 'fake-jwt-token' };
    service.login('test@example.com', 'password').subscribe(user => {
      expect(user).toEqual(dummyResponse);
      expect(sessionStorage.getItem('user')).toEqual(JSON.stringify(dummyResponse.access_token));
    });
    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });

  it('should register a user', () => {
    const dummyUser: User = { id: '1', email: 'test@example.com', password: 'password' };
    service.register(dummyUser).subscribe(user => {
      expect(user).toEqual(dummyUser);
    });
    const req = httpMock.expectOne('/api/user');
    expect(req.request.method).toBe('POST');
    req.flush(dummyUser);
  });

  it('should get a user by ID', () => {
    const dummyUser: User = { id: '1', email: 'test@example.com', password: 'password' };
    service.getUser('1').subscribe(user => {
      expect(user).toEqual(dummyUser);
    });
    const req = httpMock.expectOne('/api/user/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyUser);
  });

  it('should get all users', () => {
    const dummyUsers: User[] = [{ id: '1', email: 'test@example.com', password: 'password' }];
    service.getAllUsers().subscribe(users => {
      expect(users.length).toBe(1);
      expect(users).toEqual(dummyUsers);
    });
    const req = httpMock.expectOne('/api/user');
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should delete a user', () => {
    service.deleteUser('1').subscribe(response => {
      expect(response).toBeNull();
    });
    const req = httpMock.expectOne('/api/user/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should update a user', () => {
    const updatedUser: User = { id: '1', email: 'updated@example.com', password: 'password' };
    service.updateUser('1', updatedUser).subscribe(user => {
      expect(user).toEqual(updatedUser);
    });
    const req = httpMock.expectOne('/api/user/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedUser);
  });

  it('should logout and clear session', () => {
    spyOn(router, 'navigate');
    sessionStorage.setItem('user', 'fake-token');
    service.logout();
    expect(sessionStorage.getItem('user')).toBeNull();
    expect(service.userValue).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
