export class Timing {
  public Drivers: any[] = [];
  public CurrentSessionNum: number = 0;

  // lap time array definitions
  public CarIdxCurrentLap: number[] = [];
  public CarIdxCurrentLapStartTime: number[] = [];
  public CarIdxLapTimes: string[][] = [];
  public CarIdxGapInfront: string[] = [];

  public CarIdxPittedLap: number[] = [];
  public CarIdxPittedStart: number[] = [];
  public CarIdxPitTime: number[] = [];
  public CarIdxPitLapRecord: number[][] = [];
  public CarIdxPitLastStopTime: number[] = [];

  public CarIdxStintRecord: number[][] = [];

  private ProcessLapChange (data: any, i: number) {
    if (!this.CarIdxLapTimes[i]) {
      this.CarIdxLapTimes[i] = [];
    }
    if (data.values.CarIdxLap[i] === -1) {
      return;
    }
    // if telemetry lap is different to lap in memory
    // new lap started, calculate and insert lap time to array
    if (this.CarIdxCurrentLap[i] !== data.values.CarIdxLap[i]) {
      // calculate lap time
      const sessionTime = data.values.SessionTime;
      const startTime = this.CarIdxCurrentLapStartTime[i];
      if (!startTime) {
        this.CarIdxCurrentLapStartTime[i] = sessionTime;
        this.CarIdxCurrentLap[i] = data.values.CarIdxLap[i];
        return;
      }
      if (!this.CarIdxLapTimes[i]) {
        this.CarIdxLapTimes[i] = [];
      }
      const lapTimeSecs = (sessionTime - startTime);
      const mins = lapTimeSecs / 60;
      const seconds = lapTimeSecs - (60 * Math.floor(mins));
      this.CarIdxLapTimes[i].push(`${Math.floor(mins).toFixed(0)}:${Math.floor(seconds) >= 10 ? seconds.toFixed(2) : "0" + seconds.toFixed(2)}`);
      // insert lap time to array for carIdX
      this.CarIdxCurrentLapStartTime[i] = sessionTime;
      // update current lap to new value
      this.CarIdxCurrentLap[i] = data.values.CarIdxLap[i];

      // process gap on lap change
      const carIdxPosition = data.values.CarIdxPosition[i];
      if (carIdxPosition === 1) { this.CarIdxGapInfront[i] = "---"; }
      else {
        for (let p = 0; p < data.values.CarIdxPosition.length; p++) {
          if (data.values.CarIdxPosition[p] === (carIdxPosition - 1)) {
            if (data.values.CarIdxLap[i] === data.values.CarIdxLap[p]) {
              this.CarIdxGapInfront[i] = (this.CarIdxCurrentLapStartTime[i] - this.CarIdxCurrentLapStartTime[p]).toFixed(2);
            }
            else {
              this.CarIdxGapInfront[i] = `${data.values.CarIdxLap[p] - data.values.CarIdxLap[i]} L`;
            }
            break;
          }
        }
      }
    }
  }

  private ProcessPitlane (data: any, i: number) {
    if (!this.CarIdxPitLapRecord[i]) {
      this.CarIdxPitLapRecord[i] = [];
    }
    if (!this.CarIdxStintRecord[i]) {
      this.CarIdxStintRecord[i] = [];
    }
    if (!this.CarIdxPitTime[i]) {
      this.CarIdxPitTime[i] = 0;
    }
    if (data.values.CarIdxLap[i] === -1) {
      return;
    }
    // if car is on pit road and counter is 0
    // car has just entered the pits
    if (data.values.CarIdxOnPitRoad[i] && this.CarIdxPitTime[i] === 0 && data.values.CarIdxTrackSurface[i] === "InPitStall") {
      if (this.CarIdxPitLapRecord[i].length === 0) {
        this.CarIdxStintRecord[i].push(data.values.CarIdxLap[i]);
      } else {
        this.CarIdxStintRecord[i].push(data.values.CarIdxLap[i] -
          this.CarIdxPitLapRecord[i][this.CarIdxPitLapRecord[i].length - 1]);
      }
      this.CarIdxPittedStart[i] = data.values.SessionTime;
      this.CarIdxPittedLap[i] = data.values.CarIdxLap[i];
      this.CarIdxPitLapRecord[i].push(data.values.CarIdxLap[i]);
      // set time in pits to non 0 value
      this.CarIdxPitTime[i] = 0.1;
    }
    // if car is on pit road and counter is > 0
    // car is currently in the pits
    else if (data.values.CarIdxOnPitRoad[i] && this.CarIdxPitTime[i] > 0 && data.values.CarIdxTrackSurface[i] === "InPitStall") {
      const intermediate = (data.values.SessionTime) - (this.CarIdxPittedStart[i]);
      this.CarIdxPitTime[i] =
        intermediate > 0.1 ? intermediate : 0.1;
    }
    // if car is not on pit road
    // set pit time to 0
    // check for different lap to try and counteract telemetry gaps
    else if (!data.values.CarIdxOnPitRoad[i] && data.values.CarIdxLap[i] !== this.CarIdxPittedLap[i]) {
      if (this.CarIdxPitTime[i] > 0) {
        this.CarIdxPitLastStopTime[i] = this.CarIdxPitTime[i];
        this.CarIdxPitTime[i] = 0;
      }
    }
  }

  public CheckSessionState (data: any) {
    // check for session change i.e. practice -> race
    if (this.CurrentSessionNum !== data.values.SessionNum) {
      // reset timing data
      this.CarIdxCurrentLap = [];
      this.CarIdxCurrentLapStartTime = [];
      this.CarIdxLapTimes = [];
      this.CarIdxPittedLap = [];
      this.CarIdxPittedStart = [];
      this.CarIdxPitTime = [];
      this.CarIdxPitLapRecord = [];
      this.CarIdxPitLastStopTime = [];
      this.CarIdxStintRecord = [];
      // set current session num
      this.CurrentSessionNum = data.values.SessionNum;
    }
  }

  public GetTimingObjArray (data: any): object[] {
    let timingObjects = [];
    // process and send timing info
    if (this.Drivers.length > 0) {
      // process each acive in session (non-spectating/non-dc) driver
      for (let i = 0; i < this.Drivers.length; i++) {
        if (this.Drivers[i].CarIsPaceCar === 0
          && this.Drivers[i].IsSpectator === 0
          && data.values.CarIdxPosition[i] > 0) {
          this.ProcessLapChange(data, i);
          this.ProcessPitlane(data, i);
          timingObjects.push({
            "Name": this.Drivers[i].TeamName,
            "DriverName": this.Drivers[i].UserName,
            "CarNum": this.Drivers[i].CarNumber,
            "Position": data.values.CarIdxPosition[i],
            "ClassPosition": data.values.CarIdxClassPosition[i],
            "OnPitRoad": data.values.CarIdxOnPitRoad[i],
            "ClassColour": "#" + this.Drivers[i].CarClassColor.toString(16),
            "IRating": this.Drivers[i].IRating,
            "LicString": this.Drivers[i].LicString,
            "LicColor": "#" + this.Drivers[i].LicColor.toString(16),
            "EstTime": data.values.CarIdxEstTime[i].toFixed(1),
            "PitTime": this.CarIdxPitTime[i].toFixed(1),
            "PitLastTime": this.CarIdxPitLastStopTime[i] ? this.CarIdxPitLastStopTime[i].toFixed(1) : 0,
            "PittedLap": this.CarIdxPittedLap[i],
            "CarLap": data.values.CarIdxLap[i],
            "StintLength": this.CarIdxStintRecord[i][this.CarIdxStintRecord[i].length - 1],
            "LastLap": this.CarIdxLapTimes[i][this.CarIdxLapTimes[i].length - 1],
            "TrackSurf": data.values.CarIdxTrackSurface[i],
            "Gap": this.CarIdxGapInfront[i],
            "DistDegree": 3.6 * (data.values.CarIdxLapDistPct[i] * 100)
          });
        }
      }
      timingObjects = timingObjects.sort(
        (a, b) => (a.Position > b.Position) ? 1 : ((b.Position > a.Position) ? -1 : 0)
      );
    }
    return timingObjects;
  }
}
