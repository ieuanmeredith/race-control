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
  public throttlePerc: number;
  public brakePerc: number;
  public wheelAngle: number;

  constructor(private socketService: SocketService) { }

  public ngOnInit(): void {
    this.initSocketConnection();
  }

  private initSocketConnection(): void {
    this.socketService.initSocket();

    this.socketService.onTelemetryMessage()
      .subscribe((data: any) => {
        console.log(data);
        this.throttlePerc = Math.trunc(data.values.Throttle * 100);
        this.brakePerc = Math.trunc(data.values.Brake * 100);
        this.wheelAngle = data.values.SteeringWheelAngle;
      });

    this.socketService.onSessionMessage()
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
