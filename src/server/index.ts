import * as express from "express";
import { ITelemetry } from "./classes/telemetry";
import { Dto } from "./classes/dto";

// get port number from cmd arguments
const port = process.argv[2];

const app: any = express();
app.set("port", process.env.PORT || port);
const http: any = require("http").Server(app);
let io: SocketIO.Server = require("socket.io")(http);
app.get("/", function(req: any, res: any): void {
  res.sendFile(__dirname, "index.html");
});

let sessions: any[] = [];

//#region timing state variables
let drivers: any[] = [];
let currentSessionNum: number = 0;

// lap time array definitions
let carIdxCurrentLap: number[] = [];
let carIdxCurrentLapStartTime: number[] = [];
let carIdxLapTimes: string[][] = [];
let carIdxGapInfront: string[] = [];

let carIdxPittedLap: number[] = [];
let carIdxPittedStart: number[] = [];
let carIdxPitTime: number[] = [];
let carIdxPitLapRecord: number[][] = [];
let carIdxPitLastStopTime: number[] = [];

let carIdxStintRecord: number[][] = [];
//#endregion

//#region dash state variables
let soc: number = 0;
let deploy: number = 0;
let flags: string[] = [];
let deltaToSesBest: string = "+0.00";
let timeLeft: string = "00:00:00";
let trackTemp: string = "N/A";
let deployMode: string = "0";
let lap: number = 0;
let lapTimeArray: number[] = [];

let bufferLength: number = 18000;

let estLapTime: number = 0;
let maxFuel: number = 0;
let fuelUsageBuffer: number[] = [];
let fuelLapsRemaining: number = 0;
let fuelPerLap: string | number = 0;
let fuelRemaining: string | number = 0;
let boxboxbox: boolean = false;

let rpm: number = 0;
let fuelWeightRatio: number = 0.75;

let gear: string = "N";
//#endregion

//#region private methods
function pad(n: string, width: number, z: any) {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function getAvgLap(): number {
  let sum = 0;
  for (let i = 0; i < lapTimeArray.length; i++) {
    sum += lapTimeArray[i];
  }
  return sum / lapTimeArray.length;
}

function getAvgFuelPerHour(): number {
  let sum = 0;
  for (let i = 0; i < fuelUsageBuffer.length; i++) {
    sum += fuelUsageBuffer[i];
  }
  return sum / fuelUsageBuffer.length;
}

const processLapChange = (data: any, i: number) => {
  if (!carIdxLapTimes[i]) {
    carIdxLapTimes[i] = [];
  }
  if (data.values.CarIdxLap[i] === -1) {
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
    const seconds = lapTimeSecs - (60 * Math.floor(mins));
    carIdxLapTimes[i].push(`${Math.floor(mins).toFixed(0)}:${Math.floor(seconds) >= 10 ? seconds.toFixed(2) : "0" + seconds.toFixed(2)}`);
    // insert lap time to array for carIdX
    carIdxCurrentLapStartTime[i] = sessionTime;
    // update current lap to new value
    carIdxCurrentLap[i] = data.values.CarIdxLap[i];

    // process gap on lap change
    const carIdxPosition = data.values.CarIdxPosition[i];
    if (carIdxPosition === 1) { carIdxGapInfront[i] = "---"; }
    else {
      for (let p = 0; p < data.values.CarIdxPosition.length; p++) {
        if (data.values.CarIdxPosition[p] === (carIdxPosition - 1)) {
          if (data.values.CarIdxLap[i] === data.values.CarIdxLap[p]) {
            carIdxGapInfront[i] = (carIdxCurrentLapStartTime[i] - carIdxCurrentLapStartTime[p]).toFixed(2);
          }
          else {
            carIdxGapInfront[i] = `${data.values.CarIdxLap[p] - data.values.CarIdxLap[i]} L`;
          }
          break;
        }
      }
    }
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
  if (data.values.CarIdxOnPitRoad[i] && carIdxPitTime[i] === 0 && data.values.CarIdxTrackSurface[i] === "InPitStall") {
    if (carIdxPitLapRecord[i].length === 0) {
      carIdxStintRecord[i].push(data.values.CarIdxLap[i]);
    } else {
      carIdxStintRecord[i].push(data.values.CarIdxLap[i] -
        carIdxPitLapRecord[i][carIdxPitLapRecord[i].length - 1]);
    }
    carIdxPittedStart[i] = data.values.SessionTime;
    carIdxPittedLap[i] = data.values.CarIdxLap[i];
    carIdxPitLapRecord[i].push(data.values.CarIdxLap[i]);
    // set time in pits to non 0 value
    carIdxPitTime[i] = 0.1;
  }
  // if car is on pit road and counter is > 0
  // car is currently in the pits
  else if (data.values.CarIdxOnPitRoad[i] && carIdxPitTime[i] > 0 && data.values.CarIdxTrackSurface[i] === "InPitStall") {
    const intermediate = (data.values.SessionTime) - (carIdxPittedStart[i]);
    carIdxPitTime[i] =
      intermediate > 0.1 ? intermediate : 0.1;
  }
  // if car is not on pit road
  // set pit time to 0
  // check for different lap to try and counteract telemetry gaps
  else if (!data.values.CarIdxOnPitRoad[i] && data.values.CarIdxLap[i] !== carIdxPittedLap[i]) {
    if (carIdxPitTime[i] > 0 ) {
      carIdxPitLastStopTime[i] = carIdxPitTime[i];
      carIdxPitTime[i] = 0;
    }
  }
};
//#endregion

//#region socket methods
const web: SocketIO.Namespace =
  io.of("web")
  .on("connection", (socket: any) => {
    console.log("a user connected");
});

const receiver: SocketIO.Namespace =
  io.of("receiver").on("connection", (socket: any) => {
    console.log("a transmitter connected");

    socket.on("telemetry", (msg: any) => {
      const driver_id: any = msg.driver_id;
      // if driver_id is active driver,
      // use their telemetry data
      let activeDriver: boolean = false;
      for (let i = 0; i < drivers.length; i++) {
        if (Number(driver_id) === drivers[i].UserID) {
          activeDriver = true;
          break;
        }
      }
      if (activeDriver) {

        let timingObjects = [];
        const data: ITelemetry = msg.data;
        // check for session change i.e. practice -> race
        if (currentSessionNum !== data.values.SessionNum) {
          // reset timing data
          carIdxCurrentLap = [];
          carIdxCurrentLapStartTime = [];
          carIdxLapTimes = [];
          carIdxPittedLap = [];
          carIdxPittedStart = [];
          carIdxPitTime = [];
          carIdxPitLapRecord = [];
          carIdxPitLastStopTime = [];
          carIdxStintRecord = [];
          // set current session num
          currentSessionNum = data.values.SessionNum;
        }

        //#region process dash data
        soc = Math.floor(data.values.EnergyERSBatteryPct *  100);
        deploy = Math.floor(data.values.EnergyMGU_KLapDeployPct * 100);
        flags = data.values.SessionFlags;
        if (data.values.dcMGUKDeployFixed) {
          deployMode = data.values.dcMGUKDeployFixed.toString();
        }
        trackTemp = data.values.TrackTempCrew.toFixed(2);
        fuelRemaining = (Math.round(data.values.FuelLevel * 100) / 100).toFixed(2);

        if (fuelUsageBuffer.length <= bufferLength) {
          if (Math.floor(data.values.Speed) !== 0 && data.values.FuelLevel > 0.2) {
            fuelUsageBuffer.push(Math.round(data.values.FuelUsePerHour * 100) / 100);
          }
        }
        else {
          fuelUsageBuffer = fuelUsageBuffer.splice(1, (bufferLength - 1));
          fuelUsageBuffer.push(Math.round(data.values.FuelUsePerHour * 100) / 100);
        }

        if (lap !== data.values.Lap) {
          if (lap === 0) {
            lap = data.values.Lap;
          }
          else {
            lap = data.values.Lap;
            const lapTemp = Math.round(data.values.LapLastLapTime * 100) / 100;
            if (lapTemp > 0 && lapTimeArray.indexOf(lapTemp) === -1) {
              lapTimeArray.push(lapTemp);
            }

            if (lapTimeArray.length > 2) {
              estLapTime = getAvgLap();
            }

            fuelLapsRemaining < 2 ? boxboxbox = true : boxboxbox = false;
          }
        }

        if (maxFuel > 0 && estLapTime > 0) {
          const lapsPerHour = 3600 / estLapTime;
          const fuelPerHour = getAvgFuelPerHour();
          const localFuelPerLap = fuelPerHour / lapsPerHour;
          // minus 0.2L in kg to exclude last 0.2l from calculations
          fuelLapsRemaining = (((data.values.FuelLevel * fuelWeightRatio) - (0.2 * fuelWeightRatio)) / localFuelPerLap);
          fuelPerLap = (data.values.FuelLevel / fuelLapsRemaining).toFixed(2);
          if (fuelLapsRemaining > 2) { boxboxbox = false; }
        }

        const delta = data.values.LapDeltaToSessionBestLap.toFixed(2);
        deltaToSesBest = `${Number(delta) > 0 ? "+" : ""}${delta}`;

        const secondsLeft = Math.floor(data.values.SessionTimeRemain);
        const hours = Math.floor(secondsLeft / 3600);
        const minutes = Math.floor((secondsLeft / 60) - hours * 60);
        const seconds = secondsLeft - Math.floor((secondsLeft / 60)) * 60;
        timeLeft = `${pad(hours.toString(), 2, 0)}:${pad(minutes.toString(), 2, 0)}:${pad(seconds.toString(), 2, 0)}`;
        rpm = data.values.RPM;
        gear = data.values.Gear === 0 ? "N"
        : data.values.Gear === -1 ? "R"
        : data.values.Gear.toString();
        //#endregion

        const dto: Dto = new Dto();
        dto.values.Throttle = data.values.Throttle;
        dto.values.Brake = data.values.Brake;
        dto.values.SoC = soc.toString();
        dto.values.Deploy = deploy.toString();
        dto.values.FuelLevel = data.values.FuelLevel.toFixed(2);
        dto.values.FuelLapsLeft = fuelLapsRemaining.toFixed(2);
        dto.values.FuelPerLap = fuelPerLap.toString();
        dto.values.Delta = deltaToSesBest;
        dto.values.BoxBoxBox = boxboxbox;
        dto.values.Flags = flags;
        dto.values.Gear = gear;
        dto.values.Temp = trackTemp;
        dto.values.SessionTimeRemain = timeLeft;
        dto.values.DeployMode = deployMode;
        dto.values.Speed = (data.values.Speed * 3.6).toFixed(0) + " kph ";
        // convert input to useful value for animating rotation
        dto.values.SteeringWheelAngle = ((data.values.SteeringWheelAngle * 180) / 3.14 ) * -1;
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
                "TrackSurf": data.values.CarIdxTrackSurface[i],
                "Gap": carIdxGapInfront[i]
              });
            }
          }
          timingObjects = timingObjects.sort(
            (a, b) => (a.Position > b.Position) ? 1 : ((b.Position > a.Position) ? -1 : 0)
          );
        }
        io.of("web").emit("timing_message", timingObjects);
      }
    });

    socket.on("session", (msg: any) => {
      const session: any = msg.data;
      const driver_id: any = msg.driver_id;

      // if driver_id is active driver,
      // use their session data
      let activeDriver: boolean = false;
      for (let i = 0; i < session.data.DriverInfo.Drivers.length; i++) {
        if (Number(driver_id) === session.data.DriverInfo.Drivers[i].UserID) {
          activeDriver = true;
          break;
        }
      }
      if (activeDriver) {
        if (sessions !== session.SessionInfo.Sessions) {
          sessions = session.SessionInfo.Sessions;
        }
        if (drivers !== session.data.DriverInfo.Drivers) {
          drivers = session.data.DriverInfo.Drivers;
        }
        //#region taking session values for dash
        if (fuelWeightRatio !== session.data.DriverInfo.DriverCarFuelKgPerLtr) {
          fuelWeightRatio = session.data.DriverInfo.DriverCarFuelKgPerLtr;
        }
        maxFuel = session.data.DriverInfo.DriverCarFuelMaxLtr * fuelWeightRatio;

        if (estLapTime === 0) { estLapTime = session.data.DriverInfo.DriverCarEstLapTime; }
        //#endregion
      }
    });
});

http.listen(port, function(): void {
  console.log(`listening on *:${port}`);
});
//#endregion
