import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) {  }


  updateToken() {
    const token = JSON.parse(sessionStorage.getItem('user')!);
    this.socket.ioSocket.io.opts.query = { token };
    // this.socket.disconnect()
    this.socket.connect(); // Reconnect with the new token
  }

  createItem(item: any) {
    this.socket.emit('createItem', item);
  }

  getAllItems(): Observable<any[]> {
    return new Observable((observer) => {
      this.socket.emit('findAllItems');
      this.socket.on('allItems', (items: any) => observer.next(items));
    })
  }

  upDateItems(id: string, item: any) {
    this.socket.emit('updateItem', {id, ...item});
  }

  onItemCreated(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('itemCreated', (item: any) => observer.next(item));
    })
  }

  onItemUpdated(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('itemUpdated', (item: any) => observer.next(item));
    })
  }

  remove(id: string) {
    this.socket.emit('removeItem', id);
  }

  typing(isTyping: boolean) {
    this.socket.emit('typing', {isTyping});
  }

  onTyping(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('userTyping', (data: any) => observer.next(data));
    })
  }
}
