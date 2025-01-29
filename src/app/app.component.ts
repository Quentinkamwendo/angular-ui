import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { AccountService } from './services/account.service';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterModule,
    MatMenuModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ui';
  user$: Observable<User | null>;
  constructor(private accountService: AccountService, private router: Router) { 
    this.user$ = this.accountService.user;
   }
  private breakpointObserver = inject(BreakpointObserver);
  // private accountService = inject(AccountService);

  // ngOnInit(): void {
  // this.user = this.accountService.userValue;
  // }

  logout() {
    this.accountService.logout()
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  isAuthenticated() {
    if (this.user$) {
      this.router.navigate(['/items']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
