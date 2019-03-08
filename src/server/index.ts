import * as express from "express";
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

    socket.on("telemetry", (data) => {
      io.of("web").emit("telemetry_message", data);
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