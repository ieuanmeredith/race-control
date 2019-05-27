import * as express from "express";
import { ITelemetry } from "./classes/telemetry";
import { Dto } from "./classes/dto";
const app: any = express();
app.set("port", process.env.PORT || 3000);
const http: any = require("http").Server(app);

let io: SocketIO.Server = require("socket.io")(http);

app.get("/", function(req: any, res: any): void {
  res.sendFile(__dirname, "index.html");
});

//#region timing state variables
let drivers: any[] = [];
let timingObjects: any[] = [];

// lap time array definitions
let carIdxCurrentLap: number[] = [];
let carIdxCurrentLapStartTime: number[] = [];
let carIdxLapTimes: string[][] = [];

let carIdxPittedLap: number[] = [];
let carIdxPittedStart: number[] = [];
let carIdxPitTime: number[] = [];
let carIdxPitLapRecord: number[][] = [];
let carIdxPitLastStopTime: number[] = [];

let carIdxStintRecord: number[][] = [];
//#endregion

//#region private methods
const populateTimingObject = (data: any, i: number) => {
  timingObjects.push({
    "Name": drivers[i].TeamName,
    "DriverName": drivers[i].UserName,
    "CarNum": drivers[i].CarNumber,
    "Position": data.values.CarIdxPosition[i],
    "ClassPosition": data.values.CarIdxClassPosition[i],
    "OnPitRoad": data.values.CarIdxOnPitRoad[i],
    "ClassColour": "#" + drivers[i].CarClassColor.toString(16),
    "IRating": drivers[i].IRating,
    "LicString": drivers[i].LicString,
    "LicColor": "#" + drivers[i].LicColor.toString(16),
    "EstTime": data.values.CarIdxEstTime[i].toFixed(1),
    "PitTime": carIdxPitTime[i].toFixed(1),
    "PitLastTime": carIdxPitLastStopTime[i] ? carIdxPitLastStopTime[i].toFixed(1) : 0,
    "PittedLap": carIdxPittedLap[i],
    "CarLap": data.values.CarIdxLap[i],
    "StintLength": carIdxStintRecord[i][carIdxStintRecord[i].length - 1],
    "LastLap": carIdxLapTimes[i][carIdxLapTimes[i].length - 1],
  });
};

const processLapChange = (data: any, i: number) => {
  if (!carIdxLapTimes[i]) {
    carIdxLapTimes[i] = [];
  }
  if (carIdxCurrentLap[i] === -1) {
    return;
  }
  // if telemetry lap is different to lap in memory
  // new lap started, calculate and insert lap time to array
  if (carIdxCurrentLap[i] !== data.values.CarIdxLap[i]) {
    // calculate lap time
    const sessionTime = data.values.SessionTime;
    const startTime = carIdxCurrentLapStartTime[i];
    if (!startTime) {
      carIdxCurrentLapStartTime[i] = sessionTime;
      carIdxCurrentLap[i] = data.values.CarIdxLap[i];
      return;
    }
    if (!carIdxLapTimes[i]) {
      carIdxLapTimes[i] = [];
    }
    const lapTimeSecs = (sessionTime - startTime);
    const mins = lapTimeSecs / 60;
    const seconds = lapTimeSecs - (60 * mins);
    carIdxLapTimes[i].push(`${mins.toFixed(0)}:${seconds.toFixed(2)}`);
    // insert lap time to array for carIdX
    carIdxCurrentLapStartTime[i] = sessionTime;
    // update current lap to new value
    carIdxCurrentLap[i] = data.values.CarIdxLap[i];
  }
};

const processPitlane = (data: any, i: number) => {
  if (!carIdxPitLapRecord[i]) {
    carIdxPitLapRecord[i] = [];
  }
  if (!carIdxStintRecord[i]) {
    carIdxStintRecord[i] = [];
  }
  if (!carIdxPitTime[i]) {
    carIdxPitTime[i] = 0;
  }
  // if car is on pit road and counter is 0
  // car has just entered the pits
  if (data.values.CarIdxOnPitRoad[i] && carIdxPitTime[i] === 0) {
    carIdxStintRecord[i].push(data.values.CarIdxLap[i] -
      carIdxPitLapRecord[i][carIdxPitLapRecord[i].length - 1]);
    carIdxPittedStart[i] = data.values.SessionTime;
    carIdxPittedLap[i] = data.values.CarIdxLap[i];
    carIdxPitLapRecord[i].push(data.values.CarIdxLap[i]);
    // set time in pits to non 0 value
    carIdxPitTime[i] = 0.1;
  }
  // if car is on pit road and counter is > 0
  // car is currently in the pits
  else if (data.values.CarIdxOnPitRoad[i] && carIdxPitTime[i] > 0) {
    const intermediate = (data.values.SessionTime) - (carIdxPittedStart[i]);
    carIdxPitTime[i] =
    intermediate > 0 ? intermediate : 0.1;
  }
  // if car is not on pit road
  // set pit time to 0
  else if (!data.values.CarIdxOnPitRoad[i]) {
    if (carIdxPitTime[i] > 0 ) {
      carIdxPitLastStopTime[i] = carIdxPitTime[i];
      carIdxPitTime[i] = 0;
    }
  }
};
//#endregion

const web: SocketIO.Namespace =
  io.of("web")
  .on("connection", (socket: any) => {
    console.log("a user connected");
});

const receiver: SocketIO.Namespace =
  io.of("receiver").on("connection", (socket: any) => {
    console.log("a transmitter connected");

    socket.on("telemetry", (msg: any) => {
      const data: ITelemetry = msg.data;
      // process and send telemetry feed
      // use custom DTO instead of 'data'
      // to minimize payload size
      const dto: Dto = new Dto();
      dto.values.Throttle = data.values.Throttle;
      dto.values.Brake = data.values.Brake;
      // convert input to useful value for animating rotation
      dto.values.SteeringWheelAngle = ((data.values.SteeringWheelAngle * 180) / 3.14 ) * -1;
      // dto.values.CarIdxClassPosition = data.values.CarIdxClassPosition;
      // dto.values.CarIdxEstTime = data.values.CarIdxEstTime;
      // dto.values.CarIdxF2Time = data.values.CarIdxF2Time;
      // dto.values.CarIdxLap = data.values.CarIdxLap;
      // dto.values.CarIdxLapCompleted = data.values.CarIdxLapCompleted;
      // dto.values.CarIdxLapDistPct = data.values.CarIdxLapDistPct;
      // dto.values.CarIdxOnPitRoad = data.values.CarIdxOnPitRoad;
      // dto.values.CarIdxPosition = data.values.CarIdxPosition;
      // dto.values.CarIdxTrackSurface = data.values.CarIdxTrackSurface;
      // dto.values.SessionTime = data.values.SessionTime;
      // dto.values.SessionTimeRemain = data.values.SessionTimeRemain;
      io.of("web").emit("telemetry_message", dto);

      // process and send timing info
      if (drivers.length > 0) {
        // process each acive in session (non-spectating/non-dc) driver
        for (let i = 0; i < drivers.length; i++) {
          if (drivers[i].CarIsPaceCar === 0
            && drivers[i].IsSpectator === 0
            && data.values.CarIdxPosition[i] > 0) {
            processLapChange(data, i);
            processPitlane(data, i);
            populateTimingObject(data, i);
          }
        }
        timingObjects = timingObjects.sort(
          (a, b) => (a.Position > b.Position) ? 1 : ((b.Position > a.Position) ? -1 : 0)
        );
      }

      io.of("web").emit("timing_message", timingObjects);
    });

    socket.on("session", (msg: any) => {
      const session: any = msg.data;
      const driver_id: any = msg.id;

      // if driver_id is active driver,
      // use their session data
      let activeDriver: boolean = false;
      for (let i = 0; i < drivers.length; i++) {
        if (driver_id === drivers[i].UserID) {
          activeDriver = true;
        }
      }
      if (activeDriver) {
        drivers = session.data.DriverInfo.Drivers;
      }
    });
});

http.listen(3000, function(): void {
  console.log("listening on *:3000");
});
