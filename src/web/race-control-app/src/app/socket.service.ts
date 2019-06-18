import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import * as io from "socket.io-client";
import { AppConfig } from './config/app.config';

@Injectable({
  providedIn: "root",
})
export class SocketService {
  private socket: SocketIOClient.Socket;

  public initSocket() {
    // change before running ng build --prod
    // to specific ip/port for each car/instance
    this.socket = io(AppConfig.settings.socketService.url);
  }

  public onTelemetryMessage(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on("telemetry_message", (data: any) => observer.next(data));
    });
  }

  public onTimingMessage(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on("timing_message", (data: any) => observer.next(data));
    });
  }

  public onSessionMessage(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on("session_message", (data: any) => observer.next(data));
    });
  }

  public onEvent(event: any): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on(event, () => observer.next());
    });
  }
}
