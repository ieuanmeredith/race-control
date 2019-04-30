import { Component, OnInit, ViewChild } from "@angular/core";
import { ElementRef, Renderer2 } from "@angular/core";
import { SocketService } from "../socket.service";

@Component({
  selector: "timing",
  styleUrls: ["./timing.component.scss"],
  templateUrl: "./timing.component.html",
})

export class TimingComponent implements OnInit {
  public drivers: any[] = [];

  public timingObjects: any[] = [];

  constructor(private socketService: SocketService) {}

  public ngOnInit(): void {
    this.initSocketConnection();
  }

  private initSocketConnection(): void {
    this.socketService.initSocket();

    this.socketService.onTelemetryMessage()
    .subscribe((data: any) => {
      if (this.drivers.length > 0) {
        this.timingObjects = [];
        for (let i = 0; i < this.drivers.length; i++) {
          if (this.drivers[i].CarIsPaceCar === 0) {
            const position = data.values.CarIdxPosition[i];
            const name = this.drivers[i].TeamName;

            this.timingObjects.push({
              "Name": name,
              "Position": position,
              "ClassColour": this.drivers[i].CarClassColor.toString(16)
            });
          }
        }
      }
    });

    this.socketService.onSessionMessage()
    .subscribe((data: any) => {
      this.drivers = data.data.DriverInfo.Drivers;
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
