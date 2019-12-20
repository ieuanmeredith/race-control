import { Component, OnInit } from "@angular/core";
import { SocketService } from "../socket.service";

@Component({
  selector: "timing",
  styleUrls: ["./timing.component.scss"],
  templateUrl: "./timing.component.html",
})

export class TimingComponent implements OnInit {
  public timingObjects: any[] = [];

  constructor(private socketService: SocketService) {}

  public ngOnInit(): void {
    this.initSocketConnection();
  }

  private initSocketConnection(): void {
    this.socketService.initSocket();

    this.socketService.onTimingMessage().subscribe((data: any[]) => {
      if (this.timingObjects.length === data.length) {
        for (let i = 0; i < this.timingObjects.length; i++) {
          this.timingObjects = data;
          if (this.timingObjects[i] !== data[i]) {
            this.timingObjects[i] = data[i];
          }
        }
      }
      else if (data.length > 1) {
        this.timingObjects = data;
      }
    });

    this.socketService.onEvent("connect").subscribe(() => {
      console.log("connected to race control web server");
    });
    this.socketService.onEvent("disconnect").subscribe(() => {
      console.log("disconnected from race control web server");
    });
  }
}
