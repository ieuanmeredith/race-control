
namespace SignalRServer.Classes
{
  public class TelemetryDto
  {
    public string Name { get; set; }
    public string DriverName { get; set; }
    public int CarNum { get; set; }
    public int Position { get; set; }
    public int ClassPosition { get; set; }
    public bool OnPitRoad { get; set; }
    public string ClassColour { get; set; }
    public int IRating { get; set; }
    public string LicString { get; set; }
    public string LicColor { get; set; }
    public string EstTime { get; set; }
    public string PitTime { get; set; }
    public string PitLastTime { get; set; }
    public int PittedLap { get; set; }
    public int CarLap { get; set; }
    public int StintLength { get; set; }
    public string LastLap { get; set; }
    public string TrackSurf { get; set; }
    public string Gap { get; set; }
    public float DistDegree { get; set; }
  }
}