import { Dto } from "./dto";

export class Dash {
  private Soc: number = 0;
  private Deploy: number = 0;
  private Flags: string[] = [];
  private DeltaToSesBest: string = "+0.00";
  private TimeLeft: string = "00:00:00";
  private TrackTemp: string = "N/A";
  private DeployMode: string = "0";
  private Lap: number = 0;
  private LapTimeArray: number[] = [];

  private BufferLength: number = 18000;

  private EstLapTime: number = 0;
  private MaxFuel: number = 0;
  private FuelUsageBuffer: number[] = [];
  private FuelLapsRemaining: number = 0;
  private FuelPerLap: string | number = 0;
  private FuelRemaining: string | number = 0;
  private Boxboxbox: boolean = false;

  private Rpm: number = 0;
  private FuelWeightRatio: number = 0.75;

  private Gear: string = "N";

  public GetDashDto(data: any): Dto {
    this.Soc = Math.floor(data.values.EnergyERSBatteryPct * 100);
    this.Deploy = Math.floor(data.values.EnergyMGU_KLapDeployPct * 100);
    this.Flags = data.values.SessionFlags;
    if (data.values.dcMGUKDeployFixed) {
      this.DeployMode = data.values.dcMGUKDeployFixed.toString();
    }
    this.TrackTemp = data.values.TrackTempCrew.toFixed(2);
    this.FuelRemaining = (Math.round(data.values.FuelLevel * 100) / 100).toFixed(2);

    if (this.FuelUsageBuffer.length <= this.BufferLength) {
      if (Math.floor(data.values.Speed) !== 0 && data.values.FuelLevel > 0.2) {
        this.FuelUsageBuffer.push(Math.round(data.values.FuelUsePerHour * 100) / 100);
      }
    }
    else {
      this.FuelUsageBuffer = this.FuelUsageBuffer.splice(1, (this.BufferLength - 1));
      this.FuelUsageBuffer.push(Math.round(data.values.FuelUsePerHour * 100) / 100);
    }

    if (this.Lap !== data.values.Lap) {
      if (this.Lap === 0) {
        this.Lap = data.values.Lap;
      }
      else {
        this.Lap = data.values.Lap;
        const lapTemp = Math.round(data.values.LapLastLapTime * 100) / 100;
        if (lapTemp > 0 && this.LapTimeArray.indexOf(lapTemp) === -1) {
          this.LapTimeArray.push(lapTemp);
        }

        if (this.LapTimeArray.length > 2) {
          this.EstLapTime = this.GetAvgLap();
        }

        this.FuelLapsRemaining < 2 ? this.Boxboxbox = true : this.Boxboxbox = false;
      }
    }

    if (this.MaxFuel > 0 && this.EstLapTime > 0) {
      const lapsPerHour = 3600 / this.EstLapTime;
      const fuelPerHour = this.GetAvgFuelPerHour();
      const localFuelPerLap = fuelPerHour / lapsPerHour;
      // minus 0.2L in kg to exclude last 0.2l from calculations
      this.FuelLapsRemaining = (((data.values.FuelLevel * this.FuelWeightRatio) - (0.2 * this.FuelWeightRatio)) / localFuelPerLap);
      this.FuelPerLap = (data.values.FuelLevel / this.FuelLapsRemaining).toFixed(2);
      if (this.FuelLapsRemaining > 2) { this.Boxboxbox = false; }
    }

    const delta = data.values.LapDeltaToSessionBestLap.toFixed(2);
    this.DeltaToSesBest = `${Number(delta) > 0 ? "+" : ""}${delta}`;

    const secondsLeft = Math.floor(data.values.SessionTimeRemain);
    const hours = Math.floor(secondsLeft / 3600);
    const minutes = Math.floor((secondsLeft / 60) - hours * 60);
    const seconds = secondsLeft - Math.floor((secondsLeft / 60)) * 60;
    this.TimeLeft = `${this.Pad(hours.toString(), 2, 0)}:${this.Pad(minutes.toString(), 2, 0)}:${this.Pad(seconds.toString(), 2, 0)}`;
    this.Rpm = data.values.RPM;
    this.Gear = data.values.Gear === 0 ? "N"
      : data.values.Gear === -1 ? "R"
        : data.values.Gear.toString();

    return this.GetDto(data);
  }

  private GetDto(data: any): Dto {
    const dto: Dto = new Dto();
    dto.values.Throttle = data.values.Throttle;
    dto.values.Brake = data.values.Brake;
    dto.values.SoC = this.Soc.toString();
    dto.values.Deploy = this.Deploy.toString();
    dto.values.FuelLevel = data.values.FuelLevel.toFixed(2);
    dto.values.FuelLapsLeft = this.FuelLapsRemaining.toFixed(2);
    dto.values.FuelPerLap = this.FuelPerLap.toString();
    dto.values.Delta = this.DeltaToSesBest;
    dto.values.BoxBoxBox = this.Boxboxbox;
    dto.values.Flags = this.Flags;
    dto.values.Gear = this.Gear;
    dto.values.Temp = this.TrackTemp;
    dto.values.SessionTimeRemain = this.TimeLeft;
    dto.values.DeployMode = this.DeployMode;
    dto.values.Speed = (data.values.Speed * 3.6).toFixed(0) + " kph ";
    // convert input to useful value for animating rotation
    dto.values.SteeringWheelAngle = ((data.values.SteeringWheelAngle * 180) / 3.14) * -1;

    return dto;
  }

  private Pad(n: string, width: number, z: any) {
    z = z || "0";
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  private GetAvgLap(): number {
    let sum = 0;
    for (let i = 0; i < this.LapTimeArray.length; i++) {
      sum += this.LapTimeArray[i];
    }
    return sum / this.LapTimeArray.length;
  }

  private GetAvgFuelPerHour(): number {
    let sum = 0;
    for (let i = 0; i < this.FuelUsageBuffer.length; i++) {
      sum += this.FuelUsageBuffer[i];
    }
    return sum / this.FuelUsageBuffer.length;
  }

  public SetDataFromSession(session: any) {
    if (this.FuelWeightRatio !== session.data.DriverInfo.DriverCarFuelKgPerLtr) {
      this.FuelWeightRatio = session.data.DriverInfo.DriverCarFuelKgPerLtr;
    }
    this.MaxFuel = session.data.DriverInfo.DriverCarFuelMaxLtr * this.FuelWeightRatio;

    if (this.EstLapTime === 0) { this.EstLapTime = session.data.DriverInfo.DriverCarEstLapTime; }
  }
}
