namespace SignalRServer.Classes
{
  public class Dto
  {
    public Values Values { get; set; }
  }

  public class Values
  {
    public bool BoxBoxBox { get; set; }

    public double Brake { get; set; }

    public double[] CarIdxClassPosition { get; set; }

    public double[] CarIdxEstTime { get; set; }

    public double[] CarIdxF2Time { get; set; }

    public double[] CarIdxLap { get; set; }

    public double[] CarIdxLapCompleted { get; set; }

    public double[] CarIdxLapDistPct { get; set; }

    public bool[] CarIdxOnPitRoad { get; set; }

    public double[] CarIdxPosition { get; set; }

    public string[] CarIdxTrackSurface { get; set; }

    public string Delta { get; set; }

    public string Deploy { get; set; }

    public string DeployMode { get; set; }

    public string[] Flags { get; set; }

    public string FuelLapsLeft { get; set; }

    public string FuelLevel { get; set; }

    public string FuelPerLap { get; set; }

    public string Gear { get; set; }

    public double SessionTime { get; set; }

    public string SessionTimeRemain { get; set; }

    public string SoC { get; set; }

    public string Speed { get; set; }

    public double SteeringWheelAngle { get; set; }

    public string Temp { get; set; }

    public double Throttle { get; set; }
  }
}