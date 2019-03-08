const irsdk: any = require("node-irsdk");
const fs: any = require("fs");

import * as io from "socket.io-client";

const socket: SocketIOClient.Socket = io("http://localhost:3000/receiver");

socket.on("connect", () => {
  if(socket.connected) {
    console.log("Connected to the Race Control server");
  } else {
    console.log("Failed to connect to Race Control server");
  }
});

irsdk.init({
  telemetryUpdateInterval: 0,
  sessionInfoUpdateInterval: 2000
});

const iracing: any = irsdk.getInstance();

console.log("waiting for iRacing...");

iracing.on("Connected", function (): void {
  console.log("connected to iRacing..");
});

iracing.on("Disconnected", function (): void {
  console.log("iRacing shut down, exiting.\n");
  process.exit();
});

iracing.on("TelemetryDescription", function (data: any): void {
  console.log("got TelemetryDescription");
});

iracing.on("Telemetry", function (data: any): void {
  socket.emit("telemetry", data);
});

iracing.on("SessionInfo", function (data: any): void {
  socket.emit("session", data);
});