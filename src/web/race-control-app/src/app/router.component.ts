import { Component, OnInit, ViewChild } from "@angular/core";
import { ElementRef, Renderer2 } from "@angular/core";
import { SmoothieChart, TimeSeries } from "smoothie";
import { SocketService } from "./socket.service";
@Component({
  selector: "app-root",
  templateUrl: "./router.component.html",
})

// https://medium.com/dailyjs/real-time-apps-with-typescript-integrating-web-sockets-node-angular-e2b57cbd1ec1
export class RouterComponent implements OnInit {
    public ngOnInit(): void {
        //
    }
}
