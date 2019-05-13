import irsdk from "node-irsdk";

import * as io from "socket.io-client";

const socket: SocketIOClient.Socket = io("http://localhost:3000/receiver");

const sessionCache: any = null;

socket.on("connect", () => {
  if (socket.connected) {
    console.log("Connected to the Race Control server");
    if (this.sessionCache) {
      console.log("sending session");
      socket.emit("session", this.sessionCache);
    }
  } else {
    console.log("Failed to connect to Race Control server");
  }
});

irsdk.init({
  sessionInfoUpdateInterval: 2000,
  telemetryUpdateInterval: 64, // 15 ticks per second
});

const iracing: any = irsdk.getInstance();

console.log("waiting for iRacing...");

iracing.on("Connected", () => {
  console.log("connected to iRacing..");
});

iracing.on("Disconnected", () => {
  console.log("iRacing shut down, exiting.\n");
  // process.exit();
});

iracing.on("TelemetryDescription", (data: any) => {
  console.log("got TelemetryDescription");
});

iracing.on("Telemetry", (data: any) => {
  socket.emit("telemetry", data);
});

iracing.on("SessionInfo", (data: any) => {
  console.log("sending session");
  this.sessionCache  = data;
  socket.emit("session", data);
});
