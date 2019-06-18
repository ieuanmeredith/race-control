import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { TimingComponent } from "./timing/timing.component";
import { TrackMapComponent } from "./trackmap/trackmap.component";

const routes: Routes = [
  { path: "",  component: AppComponent },
  { path: "timing", component: TimingComponent },
  { path: "track", component: TrackMapComponent}
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule { }
