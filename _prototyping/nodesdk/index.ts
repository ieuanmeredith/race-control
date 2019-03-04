const irsdk: any = require("node-irsdk");
const fs: any = require("fs");

irsdk.init({
  telemetryUpdateInterval: 1000,
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
  console.log(data);
});

iracing.on("Telemetry", function (data: any): void {
  console.log("got Telemetry");
});

iracing.on("SessionInfo", function (data: any): void {
  console.log("got SessionInfo");
  console.log(data);
});