const irsdk: any = require("node-irsdk");
const fs: any = require("fs");

import * as io from "socket.io-client";

const socket: SocketIOClient.Socket = io("http://localhost:3000/receiver");

let sessionCache: any;

socket.on("connect", () => {
  if(socket.connected) {
    console.log("Connected to the Race Control server");
    if(this.sessionCache) {
      console.log("sending session");
      socket.emit("session", this.sessionCache);
    }
  } else {
    console.log("Failed to connect to Race Control server");
  }
});

irsdk.init({
  telemetryUpdateInterval: 64, // 15 ticks per second
  sessionInfoUpdateInterval: 2000
});

const iracing: any = irsdk.getInstance();

console.log("waiting for iRacing...");

iracing.on("Connected", function (): void {
  console.log("connected to iRacing..");
});

iracing.on("Disconnected", function (): void {
  console.log("iRacing shut down, exiting.\n");
  // process.exit();
});

iracing.on("TelemetryDescription", function (data: any): void {
  console.log("got TelemetryDescription");
});

iracing.on("Telemetry", function (data: any): void {
  socket.emit("telemetry", data);
});

iracing.on("SessionInfo", function (data: any): void {
  console.log("sending session");
  this.sessionCache  = data;
  socket.emit("session", data);
});