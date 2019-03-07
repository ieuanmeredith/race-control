import { Component, OnInit } from "@angular/core";
import { SocketService } from "./socket.service";
@Component({
  selector: "app-root",
  styleUrls: ["./app.component.scss"],
  templateUrl: "./app.component.html",
})

// https://medium.com/dailyjs/real-time-apps-with-typescript-integrating-web-sockets-node-angular-e2b57cbd1ec1
export class AppComponent implements OnInit {
  public title = "race-control-app";
  public socket: any;

  constructor(private socketService: SocketService) { }

  public ngOnInit(): void {
    this.initSocketConnection();
  }

  private initSocketConnection(): void {
    this.socketService.initSocket();

    this.socket = this.socketService.onMessage()
      .subscribe((data: any) => {
        console.log(data);
      });

    this.socketService.onEvent("connect")
      .subscribe(() => {
        console.log("connected to race control web server");
      });

    this.socketService.onEvent("disconnect")
      .subscribe(() => {
        console.log("disconnected from race control web server");
      });
  }
}
