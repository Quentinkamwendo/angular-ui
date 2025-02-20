import { TestBed } from '@angular/core/testing';
import { SocketService } from './socket.service';
import { Socket } from 'ngx-socket-io';
import { of } from 'rxjs';

class MockSocket {
  ioSocket = { io: { opts: { query: {} } } };
  emit = jasmine.createSpy('emit');
  on = jasmine.createSpy('on').and.callFake((event: string, callback: any) => {
    if (event === 'allItems') {
      callback([]);
    }
  });
  connect = jasmine.createSpy('connect');
  disconnect = jasmine.createSpy('disconnect');
}

describe('SocketService', () => {
  let service: SocketService;
  let socket: MockSocket;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SocketService,
        { provide: Socket, useClass: MockSocket }
      ]
    });
    service = TestBed.inject(SocketService);
    socket = TestBed.inject(Socket) as any;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update token and reconnect', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(JSON.stringify('test-token'));
    service.updateToken();
    expect(socket.ioSocket.io.opts.query).toEqual({ token: 'test-token' });
    expect(socket.connect).toHaveBeenCalled();
  });

  it('should emit createItem event', () => {
    const item = { name: 'Item 1' };
    service.createItem(item);
    expect(socket.emit).toHaveBeenCalledWith('createItem', item);
  });

  it('should request all items and receive them', (done) => {
    service.getAllItems().subscribe(items => {
      expect(items).toEqual([]);
      done();
    });
    expect(socket.emit).toHaveBeenCalledWith('findAllItems');
  });

  it('should emit updateItem event', () => {
    const item = { name: 'Updated Item' };
    service.upDateItems('123', item);
    expect(socket.emit).toHaveBeenCalledWith('updateItem', { id: '123', ...item });
  });

  it('should listen to itemCreated event', (done) => {
    socket.on.and.callFake((event: string, callback: any) => {
      if (event === 'itemCreated') {
        callback({ name: 'New Item' });
      }
    });
    service.onItemCreated().subscribe(item => {
      expect(item).toEqual({ name: 'New Item' });
      done();
    });
  });

  it('should emit removeItem event', () => {
    service.remove('123');
    expect(socket.emit).toHaveBeenCalledWith('removeItem', '123');
  });

  it('should emit typing event', () => {
    service.typing(true);
    expect(socket.emit).toHaveBeenCalledWith('typing', { isTyping: true });
  });
});
