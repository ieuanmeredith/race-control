import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import * as io from "socket.io-client";

@Injectable({
  providedIn: "root",
})
export class SocketService {
  private socket: SocketIOClient.Socket;

  public initSocket() {
    this.socket = io("http://localhost:3000/web");
  }

  public onMessage(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on("message", (data: any) => observer.next(data));
    });
  }

  public onEvent(event: any): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on(event, () => observer.next());
    });
  }
}
