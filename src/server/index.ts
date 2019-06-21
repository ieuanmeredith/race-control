import * as express from "express";
import { ITelemetry } from "./classes/telemetry";
import { Dto } from "./classes/dto";
import { Timing } from "./classes/timing";
import { Dash } from "./classes/dash";

// get port number from cmd arguments
const port = process.argv[2];
const app: any = express();
const http: any = require("http").Server(app);
const io: SocketIO.Server = require("socket.io")(http);

app.set("port", process.env.PORT || port);
app.get("/", function (req: any, res: any): void {
  res.sendFile(__dirname, "index.html");
});

let sessions: any[] = [];

const timing = new Timing();
const dash = new Dash();

//#region socket methods
const web: SocketIO.Namespace =
  io.of("web").on("connection", (socket: any) => {
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
        io.of("web").emit("telemetry_message", dash.GetDashDto(data));
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
        if (dash.FuelWeightRatio !== session.data.DriverInfo.DriverCarFuelKgPerLtr) {
          dash.FuelWeightRatio = session.data.DriverInfo.DriverCarFuelKgPerLtr;
        }
        dash.MaxFuel = session.data.DriverInfo.DriverCarFuelMaxLtr * dash.FuelWeightRatio;

        if (dash.EstLapTime === 0) { dash.EstLapTime = session.data.DriverInfo.DriverCarEstLapTime; }
        //#endregion
      }
    });
  });

http.listen(port, function (): void {
  console.log(`listening on *:${port}`);
});
//#endregion
