import { NgModule, APP_INITIALIZER } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { RouterComponent } from "./router.component";
import { TimingComponent } from "./timing/timing.component";
import { TrackMapComponent } from "./trackmap/trackmap.component";
import { AppConfig } from "./config/app.config";
import { HttpClientModule } from "@angular/common/http";

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}
@NgModule({
  providers: [
    AppConfig,
      {
        provide: APP_INITIALIZER,
        useFactory: initializeApp,
        deps: [AppConfig], multi: true
      }
  ],
  bootstrap: [RouterComponent],
  declarations: [
    AppComponent,
    RouterComponent,
    TimingComponent,
    TrackMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
})
export class AppModule { }
