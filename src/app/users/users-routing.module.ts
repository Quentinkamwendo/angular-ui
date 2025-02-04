import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { NewComponent } from './new/new.component';

const routes: Routes = [
  {path: '', component: UsersComponent},
  {path: ':id', component: UsersComponent},
  {path: 'new', component: NewComponent},
  {path: 'edit/:id', component: NewComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
