import { Component, OnInit, ViewChild } from "@angular/core";
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
  public carIdxCurrentLap: number[] = [];
  public carIdxCurrentLapStartTime: number[] = [];
  public carIdxLapTimes: string[][] = [];

  public carIdxPittedLap: number[] = [];
  public carIdxPittedStart: number[] = [];
  public carIdxPitTime: number[] = [];
  public carIdxPitLapRecord: number[][] = [];
  public carIdxPitLastStopTime: number[] = [];

  public carIdxStintRecord: number[][] = [];

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
            this.processLapChange(data, i);
            this.processPitlane(data, i);
            this.populateTimingObject(data, i);
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
          "DriverName": this.drivers[i].UserName,
          "CarNum": this.drivers[i].CarNumber,
          "Position": data.values.CarIdxPosition[i],
          "ClassPosition": data.values.CarIdxClassPosition[i],
          "OnPitRoad": data.values.CarIdxOnPitRoad[i],
          "ClassColour": "#" + this.drivers[i].CarClassColor.toString(16),
          "IRating": this.drivers[i].IRating,
          "LicString": this.drivers[i].LicString,
          "LicColor": "#" + this.drivers[i].LicColor.toString(16),
          "EstTime": data.values.CarIdxEstTime[i].toFixed(1),
          "PitTime": this.carIdxPitTime[i].toFixed(1),
          "PitLastTime": this.carIdxPitLastStopTime[i] ? this.carIdxPitLastStopTime[i].toFixed(1) : 0,
          "PittedLap": this.carIdxPittedLap[i],
          "CarLap": data.values.CarIdxLap[i],
          "StintLength": this.carIdxStintRecord[i][this.carIdxStintRecord[i].length - 1],
          "LastLap": this.carIdxLapTimes[i][this.carIdxLapTimes[i].length - 1]
        });
      }

      private processLapChange(data: any, i: number) {
        if (!this.carIdxLapTimes[i]) {
          this.carIdxLapTimes[i] = [];
        }
        if (this.carIdxCurrentLap[i] === -1) {
          return;
        }
        // if telemetry lap is different to lap in memory
        // new lap started, calculate and insert lap time to array
        if (this.carIdxCurrentLap[i] !== data.values.CarIdxLap[i]) {
          // calculate lap time
          const sessionTime = data.values.SessionTime;
          const startTime = this.carIdxCurrentLapStartTime[i];
          if (!startTime) {
            this.carIdxCurrentLapStartTime[i] = sessionTime;
            this.carIdxCurrentLap[i] = data.values.CarIdxLap[i];
            return;
          }
          if (!this.carIdxLapTimes[i]) {
            this.carIdxLapTimes[i] = [];
          }
          this.carIdxLapTimes[i].push((sessionTime - startTime).toFixed(2));
          // insert lap time to array for carIdX
          this.carIdxCurrentLapStartTime[i] = sessionTime;
          // update current lap to new value
          this.carIdxCurrentLap[i] = data.values.CarIdxLap[i];
        }
      }

      private processPitlane(data: any, i: number) {
        if (!this.carIdxPitLapRecord[i]) {
          this.carIdxPitLapRecord[i] = [];
        }
        if (!this.carIdxStintRecord[i]) {
          this.carIdxStintRecord[i] = [];
        }
        if (!this.carIdxPitTime[i]) {
          this.carIdxPitTime[i] = 0;
        }
        // if car is on pit road and counter is 0
        // car has just entered the pits
        if (data.values.CarIdxOnPitRoad[i] && this.carIdxPitTime[i] === 0) {
          this.carIdxPittedStart[i] = data.values.SessionTime;
          this.carIdxPittedLap[i] = data.values.CarIdxLap[i];
          this.carIdxPitLapRecord[i].push(data.values.CarIdxLap[i]);
          // set time in pits to non 0 value
          this.carIdxPitTime[i] = 0.01;
        }
        // if car is on pit road and counter is > 0
        // car is currently in the pits
        else if (data.values.CarIdxOnPitRoad[i] && this.carIdxPitTime[i] > 0) {
          const intermediate = (data.values.SessionTime) - (this.carIdxPittedStart[i]);
          this.carIdxPitTime[i] =
          intermediate > 0 ? intermediate : 0.1;
        }
        // if car is not on pit road
        // set pit time to 0
        else if (!data.values.CarIdxOnPitRoad[i]) {
          if (this.carIdxPitTime[i] > 0 ) {
            this.carIdxStintRecord[i].push(data.values.CarIdxLap[i] - this.carIdxPitLapRecord[i][this.carIdxPitLapRecord[i].length - 1]);
            this.carIdxPitLastStopTime[i] = this.carIdxPitTime[i];
            this.carIdxPitTime[i] = 0;
          }
        }
      }
    //#endregion
}
