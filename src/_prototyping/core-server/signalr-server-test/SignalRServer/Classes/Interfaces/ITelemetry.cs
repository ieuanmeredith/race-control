using System;
using System.Collections.Generic;

namespace SignalRServer.Classes.Interfaces
{
  public class Values
  {
    public double SessionTime { get; set; }
    public int SessionTick { get; set; }
    public int SessionNum { get; set; }
    public string SessionState { get; set; }
    public int SessionUniqueID { get; set; }
    public List<string> SessionFlags { get; set; }
    public int SessionTimeRemain { get; set; }
    public int SessionLapsRemain { get; set; }
    public int SessionLapsRemainEx { get; set; }
    public int RadioTransmitCarIdx { get; set; }
    public int RadioTransmitRadioIdx { get; set; }
    public int RadioTransmitFrequencyIdx { get; set; }
    public int DisplayUnits { get; set; }
    public bool DriverMarker { get; set; }
    public bool PushToPass { get; set; }
    public bool IsOnTrack { get; set; }
    public bool IsReplayPlaying { get; set; }
    public int ReplayFrameNum { get; set; }
    public int ReplayFrameNumEnd { get; set; }
    public bool IsDiskLoggingEnabled { get; set; }
    public bool IsDiskLoggingActive { get; set; }
    public double FrameRate { get; set; }
    public double CpuUsageBG { get; set; }
    public int PlayerCarPosition { get; set; }
    public int PlayerCarClassPosition { get; set; }
    public string PlayerTrackSurface { get; set; }
    public string PlayerTrackSurfaceMaterial { get; set; }
    public int PlayerCarIdx { get; set; }
    public int PlayerCarTeamIncidentCount { get; set; }
    public int PlayerCarMyIncidentCount { get; set; }
    public int PlayerCarDriverIncidentCount { get; set; }
    public int PlayerCarWeightPenalty { get; set; }
    public List<int> CarIdxLap { get; set; }
    public List<int> CarIdxLapCompleted { get; set; }
    public List<int> CarIdxLapDistPct { get; set; }
    public List<string> CarIdxTrackSurface { get; set; }
    public List<string> CarIdxTrackSurfaceMaterial { get; set; }
    public List<bool> CarIdxOnPitRoad { get; set; }
    public List<int> CarIdxPosition { get; set; }
    public List<int> CarIdxClassPosition { get; set; }
    public List<int> CarIdxF2Time { get; set; }
    public List<int> CarIdxEstTime { get; set; }
    public bool OnPitRoad { get; set; }
    public List<int> CarIdxSteer { get; set; }
    public List<int> CarIdxRPM { get; set; }
    public List<int> CarIdxGear { get; set; }
    public int SteeringWheelAngle { get; set; }
    public int Throttle { get; set; }
    public int Brake { get; set; }
    public int Clutch { get; set; }
    public int Gear { get; set; }
    public int RPM { get; set; }
    public int Lap { get; set; }
    public int LapCompleted { get; set; }
    public int LapDist { get; set; }
    public int LapDistPct { get; set; }
    public int RaceLaps { get; set; }
    public int LapBestLap { get; set; }
    public int LapBestLapTime { get; set; }
    public int LapLastLapTime { get; set; }
    public int LapCurrentLapTime { get; set; }
    public int LapLasNLapSeq { get; set; }
    public int LapLastNLapTime { get; set; }
    public int LapBestNLapLap { get; set; }
    public int LapBestNLapTime { get; set; }
    public int LapDeltaToBestLap { get; set; }
    public int LapDeltaToBestLap_DD { get; set; }
    public bool LapDeltaToBestLap_OK { get; set; }
    public int LapDeltaToOptimalLap { get; set; }
    public int LapDeltaToOptimalLap_DD { get; set; }
    public bool LapDeltaToOptimalLap_OK { get; set; }
    public int LapDeltaToSessionBestLap { get; set; }
    public int LapDeltaToSessionBestLap_DD { get; set; }
    public bool LapDeltaToSessionBestLap_OK { get; set; }
    public int LapDeltaToSessionOptimalLap { get; set; }
    public int LapDeltaToSessionOptimalLap_DD { get; set; }
    public bool LapDeltaToSessionOptimalLap_OK { get; set; }
    public int LapDeltaToSessionLastlLap { get; set; }
    public int LapDeltaToSessionLastlLap_DD { get; set; }
    public bool LapDeltaToSessionLastlLap_OK { get; set; }
    public int LongAccel { get; set; }
    public int LatAccel { get; set; }
    public int VertAccel { get; set; }
    public int RollRate { get; set; }
    public int PitchRate { get; set; }
    public int YawRate { get; set; }
    public int Speed { get; set; }
    public int VelocityX { get; set; }
    public int VelocityY { get; set; }
    public int VelocityZ { get; set; }
    public int Yaw { get; set; }
    public int YawNorth { get; set; }
    public int Pitch { get; set; }
    public int Roll { get; set; }
    public int EnterExitReset { get; set; }
    public double TrackTemp { get; set; }
    public double TrackTempCrew { get; set; }
    public double AirTemp { get; set; }
    public int WeatherType { get; set; }
    public int Skies { get; set; }
    public double AirDensity { get; set; }
    public double AirPressure { get; set; }
    public double WindVel { get; set; }
    public double WindDir { get; set; }
    public double RelativeHumidity { get; set; }
    public int FogLevel { get; set; }
    public int DCLapStatus { get; set; }
    public int DCDriversSoFar { get; set; }
    public bool OkToReloadTextures { get; set; }
    public List<string> CarLeftRight { get; set; }
    public int PitRepairLeft { get; set; }
    public int PitOptRepairLeft { get; set; }
    public int CamCarIdx { get; set; }
    public int CamCameraNumber { get; set; }
    public int CamGroupNumber { get; set; }
    public List<string> CamCameraState { get; set; }
    public bool IsOnTrackCar { get; set; }
    public bool IsInGarage { get; set; }
    public int SteeringWheelPctTorque { get; set; }
    public int SteeringWheelPctTorqueSign { get; set; }
    public int SteeringWheelPctTorqueSignStops { get; set; }
    public int SteeringWheelPctDamper { get; set; }
    public double SteeringWheelAngleMax { get; set; }
    public int ShiftIndicatorPct { get; set; }
    public int ShiftPowerPct { get; set; }
    public int ShiftGrindRPM { get; set; }
    public int ThrottleRaw { get; set; }
    public int BrakeRaw { get; set; }
    public int HandbrakeRaw { get; set; }
    public int SteeringWheelPeakForceNm { get; set; }
    public List<object> EngineWarnings { get; set; }
    public int FuelLevel { get; set; }
    public int FuelLevelPct { get; set; }
    public List<object> PitSvFlags { get; set; }
    public int PitSvLFP { get; set; }
    public int PitSvRFP { get; set; }
    public int PitSvLRP { get; set; }
    public int PitSvRRP { get; set; }
    public int PitSvFuel { get; set; }
    public int ReplayPlaySpeed { get; set; }
    public bool ReplayPlaySlowMotion { get; set; }
    public double ReplaySessionTime { get; set; }
    public int ReplaySessionNum { get; set; }
    public int TireLF_RumblePitch { get; set; }
    public int TireRF_RumblePitch { get; set; }
    public int TireLR_RumblePitch { get; set; }
    public int TireRR_RumblePitch { get; set; }
    public int dcAntiRollFront { get; set; }
    public int dcAntiRollRear { get; set; }
    public int dcBrakeBias { get; set; }
    public double SteeringWheelTorque { get; set; }
    public List<double> SteeringWheelTorque_ST { get; set; }
    public double RFcoldPressure { get; set; }
    public double RFtempCL { get; set; }
    public double RFtempCM { get; set; }
    public double RFtempCR { get; set; }
    public int RFwearL { get; set; }
    public int RFwearM { get; set; }
    public int RFwearR { get; set; }
    public double LFcoldPressure { get; set; }
    public double LFtempCL { get; set; }
    public double LFtempCM { get; set; }
    public double LFtempCR { get; set; }
    public int LFwearL { get; set; }
    public int LFwearM { get; set; }
    public int LFwearR { get; set; }
    public int WaterTemp { get; set; }
    public int WaterLevel { get; set; }
    public double FuelPress { get; set; }
    public int FuelUsePerHour { get; set; }
    public int OilTemp { get; set; }
    public int OilPress { get; set; }
    public int OilLevel { get; set; }
    public int Voltage { get; set; }
    public int ManifoldPress { get; set; }
    public double RRcoldPressure { get; set; }
    public double RRtempCL { get; set; }
    public double RRtempCM { get; set; }
    public double RRtempCR { get; set; }
    public int RRwearL { get; set; }
    public int RRwearM { get; set; }
    public int RRwearR { get; set; }
    public double LRcoldPressure { get; set; }
    public double LRtempCL { get; set; }
    public double LRtempCM { get; set; }
    public double LRtempCR { get; set; }
    public int LRwearL { get; set; }
    public int LRwearM { get; set; }
    public int LRwearR { get; set; }
    public double RRshockDefl { get; set; }
    public List<double> RRshockDefl_ST { get; set; }
    public double RRshockVel { get; set; }
    public List<double> RRshockVel_ST { get; set; }
    public double LRshockDefl { get; set; }
    public List<double> LRshockDefl_ST { get; set; }
    public double LRshockVel { get; set; }
    public List<double> LRshockVel_ST { get; set; }
    public double RFshockDefl { get; set; }
    public List<double> RFshockDefl_ST { get; set; }
    public double RFshockVel { get; set; }
    public List<double> RFshockVel_ST { get; set; }
    public double LFshockDefl { get; set; }
    public List<double> LFshockDefl_ST { get; set; }
    public double LFshockVel { get; set; }
    public List<double> LFshockVel_ST { get; set; }
    public double EnergyERSBatteryPct { get; set; }
    public double EnergyMGU_KLapDeployPct { get; set; }
    public double dcMGUKDeployFixed { get; set; }
  }

  public interface ITelemetry
  {
    public DateTime timestamp { get; set; }
    public Values values { get; set; }
  }
}