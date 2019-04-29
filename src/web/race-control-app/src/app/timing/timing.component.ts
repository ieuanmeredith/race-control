import { Component, OnInit, ViewChild } from "@angular/core";
import { ElementRef, Renderer2 } from "@angular/core";
import { SocketService } from "../socket.service";

@Component({
  selector: "timing",
  styleUrls: ["./timing.component.scss"],
  templateUrl: "./timing.component.html",
})

export class TimingComponent implements OnInit {
  constructor(private socketService: SocketService) { }

  public ngOnInit(): void {
    this.initSocketConnection();
  }
  private initSocketConnection(): void {
    this.socketService.initSocket();

    this.socketService.onTelemetryMessage()
    .subscribe((data: any) => {
      console.log(data);
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
