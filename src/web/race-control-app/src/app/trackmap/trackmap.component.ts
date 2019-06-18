import { Component, OnInit } from "@angular/core";
import { SocketService } from "../socket.service";

@Component({
  selector: "trackmap",
  styleUrls: ["./trackmap.component.scss"],
  templateUrl: "./trackmap.component.html",
})

export class TrackMapComponent implements OnInit {
  public timingObjects: any[] = [];

  constructor(private socketService: SocketService) {}

  public ngOnInit(): void {
    this.initSocketConnection();
  }

  private initSocketConnection(): void {
    this.socketService.initSocket();

    this.socketService.onTimingMessage().subscribe((data: any) => {
      if (this.timingObjects.length === data.length) {
        for (let i = 0; i < this.timingObjects.length; i++) {
          this.timingObjects = data;
          if (this.timingObjects[i] !== data[i]) {
            this.timingObjects[i] = data[i];
          }
        }
      }
      else {
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
