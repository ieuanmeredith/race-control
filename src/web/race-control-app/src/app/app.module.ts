import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { RouterComponent } from "./router.component";
import { TimingComponent } from "./timing.component";

@NgModule({
  bootstrap: [RouterComponent],
  declarations: [
    AppComponent,
    RouterComponent,
    TimingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
})
export class AppModule { }
