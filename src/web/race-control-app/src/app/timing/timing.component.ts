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

  // lap time array definitions
  public carIdXCurrentLap: number[] = [];
  public carIdXCurrentLapStartTime: number[] = [];
  public carIdXLapTimes: number[][] = [];

  public carIdxPittedLap: number[] = [];
  public carIdxPittedStart: number[] = [];
  public carIdxPitTime: number[] = [];
  public carIdxPitLapRecord: number[][] = [];

  constructor(private socketService: SocketService) {}

  public ngOnInit(): void {
    this.initSocketConnection();
  }

  private initSocketConnection(): void {
    this.socketService.initSocket();

    // each event represents 1 tick of telemetry data
    this.socketService.onTelemetryMessage().subscribe((data: any) => {
      if (this.drivers.length > 0) {
        this.timingObjects = [];
        // process each acive in session (non-spectating/non-dc) driver
        for (let i = 0; i < this.drivers.length; i++) {
          if (this.drivers[i].CarIsPaceCar === 0
            && this.drivers[i].IsSpectator === 0
            && data.values.CarIdxPosition[i] > 0) {
            this.populateTimingObject(data, i);
            this.processLapChange(data, i);
            this.processPitlane(data, i);
          }
        }
        this.timingObjects = this.timingObjects.sort((a, b) => (a.Position > b.Position) ? 1 : ((b.Position > a.Position) ? -1 : 0));
      }
    });

    this.socketService.onSessionMessage().subscribe((data: any) => {
      // update driver array to match server
      this.drivers = data.data.DriverInfo.Drivers;
    });

    this.socketService.onEvent("connect").subscribe(() => {
      console.log("connected to race control web server");
    });
    this.socketService.onEvent("disconnect").subscribe(() => {
      console.log("disconnected from race control web server");
    });
  }

    //#region private methods
      private populateTimingObject(data: any, i: number) {
        this.timingObjects.push({
          "Name": this.drivers[i].TeamName,
          "Position": data.values.CarIdxPosition[i],
          "ClassPosition": data.values.CarIdxClassPosition[i],
          "OnPitRoad": data.values.CarIdxOnPitRoad[i],
          "ClassColour": "#" + this.drivers[i].CarClassColor.toString(16),
          "IRating": this.drivers[i].IRating,
          "LicString": this.drivers[i].LicString,
          "LicColor": "#" + this.drivers[i].LicColor.toString(16),
          "EstTime": data.values.CarIdxEstTime[i].toFixed(1)
        });
      }

      private processLapChange(data: any, i: number) {
        // ensuring base 0 figure is set
        if (data.values.CarIdxLap[i] === 0) {
          this.carIdXCurrentLap[i] = 0;
        }
        // if telemetry lap is different to lap in memory
        // new lap started, calculate and insert lap time to array
        else if (this.carIdXCurrentLap[i] !== data.values.CarIdxLap[i]) {
          // calculate lap time
          const timeRemaining = data.values.SessionTimeRemain;
          const startTime = this.carIdXCurrentLapStartTime[i];
          this.carIdXLapTimes[i][data.values.carIdXCurrentLap[i]] = startTime - timeRemaining;
          // insert lap time to array for carIdX
          this.carIdXCurrentLapStartTime[i] = timeRemaining;
          // update current lap to new value
          this.carIdXCurrentLap[i] = data.values.CarIdxLap[i];
        }
      }

      private processPitlane(data: any, i: number) {
        if (!this.carIdxPitLapRecord[i]) {
          this.carIdxPitLapRecord[i] = [];
        }
        // if car is on pit road and counter is 0
        // car has just entered the pits
        if (data.value.CarIdxOnPitRoad[i] && this.carIdxPitTime[i] === 0) {
          this.carIdxPittedStart[i] = data.values.SessionTime;
          this.carIdxPittedLap[i] = data.values.CarIdxLap[i];
          this.carIdxPitLapRecord[i].push(data.value.CarIdxLap[i]);
          // set time in pits to non 0 value
          this.carIdxPitTime[i] = 0.01;
        }
        // if car is on pit road and counter is > 0
        // car is currently in the pits
        else if (data.value.CarIdxOnPitRoad[i] && this.carIdxPitTime[i] > 0) {
          this.carIdxPitTime[i] =
            (data.values.SessionTime - this.carIdxPittedStart[i]);
        }
        // if car is not on pit road
        // set pit time to 0
        else if (!data.value.CarIdxOnPitRoad[i]) {
          this.carIdxPitTime[i] = 0;
        }
      }
    //#endregion
}
