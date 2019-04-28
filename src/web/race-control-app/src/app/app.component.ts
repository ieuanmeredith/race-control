import { Component, OnInit, ViewChild } from "@angular/core";
import { ElementRef, Renderer2 } from "@angular/core";
import { SmoothieChart, TimeSeries } from "smoothie";
import { SocketService } from "./socket.service";
@Component({
  selector: "telemetry",
  styleUrls: ["./app.component.scss"],
  templateUrl: "./app.component.html",
})

// https://medium.com/dailyjs/real-time-apps-with-typescript-integrating-web-sockets-node-angular-e2b57cbd1ec1
export class AppComponent implements OnInit {
  public title = "race-control-app";
  public throttlePerc: number;
  public brakePerc: number;
  public wheelAngle: number;
  public throttleTimeSeries = new TimeSeries();
  public brakeTimeSeries = new TimeSeries();
  @ViewChild("throttlecanvas") private throttleEl: ElementRef;
  @ViewChild("brakecanvas") private brakeEl: ElementRef;
  constructor(private socketService: SocketService) { }

  public ngOnInit(): void {
    this.initSocketConnection();
    this.createThrottleTimeline();
    this.createBrakeTimeline();
  }

  private createThrottleTimeline() {
    const chart = new SmoothieChart({maxValue: 100, minValue: 0});
    chart.addTimeSeries(this.throttleTimeSeries,
      { strokeStyle: "rgba(0, 0, 255, 1)", fillStyle: "rgba(0, 0, 255, 0.2)", lineWidth: 3 });
    chart.streamTo(this.throttleEl.nativeElement, 0);
  }
  private createBrakeTimeline() {
    const chart = new SmoothieChart({maxValue: 100, minValue: 0});
    chart.addTimeSeries(this.brakeTimeSeries,
      { strokeStyle: "rgba(255, 0, 0, 1)", fillStyle: "rgba(255, 0, 0, 0.2)", lineWidth: 3 });
    chart.streamTo(this.brakeEl.nativeElement, 0);
  }

  private initSocketConnection(): void {
    this.socketService.initSocket();

    this.socketService.onTelemetryMessage()
      .subscribe((data: any) => {
        this.throttlePerc = Math.trunc(data.values.Throttle * 100);
        this.brakePerc = Math.trunc(data.values.Brake * 100);
        this.wheelAngle = data.values.SteeringWheelAngle;

        this.throttleTimeSeries.append(new Date().getTime(), this.throttlePerc);
        this.brakeTimeSeries.append(new Date().getTime(), this.brakePerc);
      });

    this.socketService.onSessionMessage()
      .subscribe((data: any) => {
        console.log(data);
      });

    this.socketService.onEvent("connect")
      .subscribe(() => {
        console.log("connected to race control web server");
      });

    this.socketService.onEvent("disconnect")
      .subscribe(() => {
        console.log("disconnected from race control web server");
      });
  }
}
