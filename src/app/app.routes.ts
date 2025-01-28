import { Routes } from '@angular/router';
import { ItemsComponent } from './items/items.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './helpers/auth.guard';

export const routes: Routes = [
    {path: 'items', component: ItemsComponent, canActivate: [authGuard]},
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
];
