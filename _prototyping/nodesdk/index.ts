const irsdk: any = require("node-irsdk");
const fs: any = require("fs");

irsdk.init({
  telemetryUpdateInterval: 10000,
  sessionInfoUpdateInterval: 10000
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
  console.log("got Telemetry");
  console.log(JSON.stringify(data));
});

iracing.on("SessionInfo", function (data: any): void {
  console.log("got SessionInfo");
  console.log(JSON.stringify(data));
});