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

let sessionData = {};

const receiver: SocketIO.Namespace =
  io.of("receiver")
  .on("connection", (socket: any) => {
    console.log("a transmitter connected");

    socket.on("telemetry", (data: ITelemetry) => {
      // use custom DTO instead of 'data'
      // to minimize payload size
      const dto: Dto = new Dto();
      dto.values.Throttle = data.values.Throttle;
      dto.values.Brake = data.values.Brake;
      // convert input to useful value for animating rotation
      dto.values.SteeringWheelAngle = ((data.values.SteeringWheelAngle * 180) / 3.14 ) * -1;
      dto.values.CarIdxClassPosition = data.values.CarIdxClassPosition;
      dto.values.CarIdxEstTime = data.values.CarIdxEstTime;
      dto.values.CarIdxF2Time = data.values.CarIdxF2Time;
      dto.values.CarIdxLap = data.values.CarIdxLap;
      dto.values.CarIdxLapCompleted = data.values.CarIdxLapCompleted;
      dto.values.CarIdxLapDistPct = data.values.CarIdxLapDistPct;
      dto.values.CarIdxOnPitRoad = data.values.CarIdxOnPitRoad;
      dto.values.CarIdxPosition = data.values.CarIdxPosition;
      dto.values.CarIdxTrackSurface = data.values.CarIdxTrackSurface;
      dto.values.SessionTime = data.values.SessionTime;
      dto.values.SessionTimeRemain = data.values.SessionTimeRemain;
      io.of("web").emit("telemetry_message", dto);

      // timing
      const timingDto: any = {
        values: {}
      };
      timingDto.values.SessionTimeRemain = data.values.SessionTimeRemain;
      timingDto.values.CarIdxClassPosition = data.values.CarIdxClassPosition;
      timingDto.values.CarIdxEstTime = data.values.CarIdxEstTime;
      timingDto.values.CarIdxF2Time = data.values.CarIdxF2Time;
      timingDto.values.CarIdxLap = data.values.CarIdxLap;
      timingDto.values.CarIdxLapCompleted = data.values.CarIdxLapCompleted;
      timingDto.values.CarIdxLapDistPct = data.values.CarIdxLapDistPct;
      timingDto.values.CarIdxOnPitRoad = data.values.CarIdxOnPitRoad;
      timingDto.values.CarIdxPosition = data.values.CarIdxPosition;
      io.of("web").emit("timing_message", timingDto);
    });

    socket.on("session", (data) => {
      sessionData = data;
      io.of("web").emit("session_message", data);
    });
});

const web: SocketIO.Namespace =
  io.of("web")
  .on("connection", (socket: any) => {
    console.log("a user connected");
    // send stored sessionData
    io.of("web").emit("session_message", sessionData);
});

http.listen(3000, function(): void {
  console.log("listening on *:3000");
});
