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

const receiver: SocketIO.Namespace =
  io.of("receiver")
  .on("connection", (socket: any) => {
    console.log("a transmitter connected");

    socket.on("telemetry", (data: ITelemetry) => {
      // use custom DTO instead of 'data'
      // to minimize payload size
      const dto: Dto = new Dto();
      dto.values.Throttle = data.values.ThrottleRaw;
      dto.values.Brake = data.values.BrakeRaw;
      // convert input to useful value for animating rotation
      dto.values.SteeringWheelAngle = ((data.values.SteeringWheelAngle * 180) / 3.14 )* -1;
      io.of("web").emit("telemetry_message", dto);
    });

    socket.on("session", (data) => {
      io.of("web").emit("session_message", data);
    });
});

const web: SocketIO.Namespace =
  io.of("web")
  .on("connection", (socket: any) => {
    console.log("a user connected");
});

http.listen(3000, function(): void {
  console.log("listening on *:3000");
});