import * as express from "express";
import { ITelemetry } from "./classes/telemetry";
import { Dto } from "./classes/dto";
import { Timing } from "./classes/timing";

// get port number from cmd arguments
const port = process.argv[2];

const app: any = express();
app.set("port", process.env.PORT || port);
const http: any = require("http").Server(app);
let io: SocketIO.Server = require("socket.io")(http);
app.get("/", function (req: any, res: any): void {
  res.sendFile(__dirname, "index.html");
});

let sessions: any[] = [];

const timing = new Timing();

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
const pad = (n: string, width: number, z: any) => {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

const getAvgLap = (): number => {
  let sum = 0;
  for (let i = 0; i < lapTimeArray.length; i++) {
    sum += lapTimeArray[i];
  }
  return sum / lapTimeArray.length;
};

const getAvgFuelPerHour = (): number => {
  let sum = 0;
  for (let i = 0; i < fuelUsageBuffer.length; i++) {
    sum += fuelUsageBuffer[i];
  }
  return sum / fuelUsageBuffer.length;
};

// processes dash data and emits event to websocket
const processDash = (data: any) => {
  //#region process dash data
  soc = Math.floor(data.values.EnergyERSBatteryPct * 100);
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
    dto.values.SteeringWheelAngle = ((data.values.SteeringWheelAngle * 180) / 3.14) * -1;
    io.of("web").emit("telemetry_message", dto);
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
      for (let i = 0; i < timing.Drivers.length; i++) {
        if (Number(driver_id) === timing.Drivers[i].UserID) {
          activeDriver = true;
          break;
        }
      }
      if (activeDriver) {
        const data: ITelemetry = msg.data;
        timing.CheckSessionState(data);

        processDash(data);

        io.of("web").emit("timing_message", timing.GetTimingObjArray(data));
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
        if (sessions !== session.data.SessionInfo.Sessions) {
          sessions = session.data.SessionInfo.Sessions;
        }
        if (timing.Drivers !== session.data.DriverInfo.Drivers) {
          timing.Drivers = session.data.DriverInfo.Drivers;
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

http.listen(port, function (): void {
  console.log(`listening on *:${port}`);
});
//#endregion
