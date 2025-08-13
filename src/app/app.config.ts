import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './helpers/auth.interceptor';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://nestjs-api-psi.vercel.app';
const user = sessionStorage.getItem('user');
const token = user ? JSON.parse(user) : null;

const config: SocketIoConfig = {
  url: API_BASE_URL,
  options: { query: { token } },
  // options: { query: { token: JSON.parse(sessionStorage.getItem('user')!) } },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(SocketIoModule.forRoot(config)),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
