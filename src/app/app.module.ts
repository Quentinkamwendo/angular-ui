import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

const user = sessionStorage.getItem('user');
const token = user ? JSON.parse(user) : null;

const config: SocketIoConfig = {
  url: 'http://localhost:3000',
  options: { query: { token } },
  // options: { query: { token: JSON.parse(sessionStorage.getItem('user')!) } },
};

@NgModule({
  declarations: [],
  imports: [CommonModule, SocketIoModule.forRoot(config)],
  providers: [SocketIoModule],
})
export class AppModule {}
