import { Routes } from '@angular/router';
import { ItemsComponent } from './items/items.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './helpers/auth.guard';

const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
const registerModule = () => import('./register/register.module').then(x => x.RegisterModule);

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'items', component: ItemsComponent, canActivate: [authGuard]},
    {path: 'register', loadChildren: registerModule},
    {path: 'login', component: LoginComponent},
    {path: 'users', loadChildren: usersModule, canActivate: [authGuard]},
];
