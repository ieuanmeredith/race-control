import * as express from "express";
import { setInterval } from "timers";
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
});

const web: SocketIO.Namespace =
  io.of("web")
  .on("connection", (socket: any) => {
    console.log("a user connected");
});

http.listen(3000, function(): void {
  console.log("listening on *:3000");
});

let i = 0;
let up = true;
setInterval(() => {
  io.of("web").emit("telemetry_message", { 
    values: { 
      Throttle: i/100,
      Brake: (100-i)/100,
      SteeringWheelAngle: i
    }
  });
  if(up) {
    if(i === 100) {
      up = false;
      i -= 10;
    } else {
      i += 10;
    }
  }else {
    if(i === 0) {
      up = true;
      i += 10;
    } else {
      i -= 10;
    }
  }
}, 100);