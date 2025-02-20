import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../services/account.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);
  const user = accountService.userValue;
  const isLoggedIn = user && user.access_token;
  const isApiUrl = req.url.startsWith('api');
  if (isLoggedIn && isApiUrl) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${user.access_token}`,
      }
    })
  }
  return next(req);
};
