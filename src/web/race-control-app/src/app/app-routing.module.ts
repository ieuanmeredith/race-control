import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { TimingComponent } from "./timing.component";

const routes: Routes = [
  { path: "",  component: AppComponent },
  { path: "timing", component: TimingComponent },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule { }
