import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { User } from '../_models/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    this.userSubject = new BehaviorSubject(JSON.parse(sessionStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
   }

   public get userValue() {
      return this.userSubject.value;
   }

  login(email: string, password: string) {
    return this.http.post<any>('/api/auth/login', { email, password }).pipe(map(user => {
      sessionStorage.setItem('user', JSON.stringify(user.access_token));
      this.userSubject.next(user);
      return user;
    }));
  }

  register(user: User) {
    return this.http.post<User>('/api/user', user);
  }

  logout() {
    sessionStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

}
