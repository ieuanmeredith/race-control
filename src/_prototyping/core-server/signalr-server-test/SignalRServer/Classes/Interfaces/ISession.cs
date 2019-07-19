using System;
using System.Collections.Generic;

namespace SignalRServer.Classes.Interfaces
{
  public class WeekendOptions
  {
    public int NumStarters { get; set; }
    public string StartingGrid { get; set; }
    public string QualifyScoring { get; set; }
    public string CourseCautions { get; set; }
    public int StandingStart { get; set; }
    public string Restarts { get; set; }
    public string WeatherType { get; set; }
    public string Skies { get; set; }
    public string WindDirection { get; set; }
    public string WindSpeed { get; set; }
    public string WeatherTemp { get; set; }
    public string RelativeHumidity { get; set; }
    public string FogLevel { get; set; }
    public string TimeOfDay { get; set; }
    public int Unofficial { get; set; }
    public string CommercialMode { get; set; }
    public int NightMode { get; set; }
    public int IsFixedSetup { get; set; }
    public string StrictLapsChecking { get; set; }
    public int HasOpenRegistration { get; set; }
    public int HardcoreLevel { get; set; }
    public string IncidentLimit { get; set; }
  }

  public class TelemetryOptions
  {
    public string TelemetryDiskFile { get; set; }
  }

  public class WeekendInfo
  {
    public string TrackName { get; set; }
    public int TrackID { get; set; }
    public string TrackLength { get; set; }
    public string TrackDisplayName { get; set; }
    public string TrackDisplayShortName { get; set; }
    public string TrackConfigName { get; set; }
    public string TrackCity { get; set; }
    public string TrackCountry { get; set; }
    public string TrackAltitude { get; set; }
    public string TrackLatitude { get; set; }
    public string TrackLongitude { get; set; }
    public string TrackNorthOffset { get; set; }
    public int TrackNumTurns { get; set; }
    public string TrackPitSpeedLimit { get; set; }
    public string TrackType { get; set; }
    public string TrackDirection { get; set; }
    public string TrackWeatherType { get; set; }
    public string TrackSkies { get; set; }
    public string TrackSurfaceTemp { get; set; }
    public string TrackAirTemp { get; set; }
    public string TrackAirPressure { get; set; }
    public string TrackWindVel { get; set; }
    public string TrackWindDir { get; set; }
    public string TrackRelativeHumidity { get; set; }
    public string TrackFogLevel { get; set; }
    public int TrackCleanup { get; set; }
    public int TrackDynamicTrack { get; set; }
    public int SeriesID { get; set; }
    public int SeasonID { get; set; }
    public int SessionID { get; set; }
    public int SubSessionID { get; set; }
    public int LeagueID { get; set; }
    public int Official { get; set; }
    public int RaceWeek { get; set; }
    public string EventType { get; set; }
    public string Category { get; set; }
    public string SimMode { get; set; }
    public int TeamRacing { get; set; }
    public int MinDrivers { get; set; }
    public int MaxDrivers { get; set; }
    public string DCRuleSet { get; set; }
    public int QualifierMustStartRace { get; set; }
    public int NumCarClasses { get; set; }
    public int NumCarTypes { get; set; }
    public WeekendOptions WeekendOptions { get; set; }
    public TelemetryOptions TelemetryOptions { get; set; }
  }

  public class ResultsFastestLap
  {
    public int CarIdx { get; set; }
    public int FastestLap { get; set; }
    public int FastestTime { get; set; }
  }

  public class Session
  {
    public int SessionNum { get; set; }
    public string SessionLaps { get; set; }
    public string SessionTime { get; set; }
    public int SessionNumLapsToAvg { get; set; }
    public string SessionType { get; set; }
    public string SessionTrackRubberState { get; set; }
    public object ResultsPositions { get; set; }
    public List<ResultsFastestLap> ResultsFastestLap { get; set; }
    public int ResultsAverageLapTime { get; set; }
    public int ResultsNumCautionFlags { get; set; }
    public int ResultsNumCautionLaps { get; set; }
    public int ResultsNumLeadChanges { get; set; }
    public int ResultsLapsComplete { get; set; }
    public int ResultsOfficial { get; set; }
  }

  public class SessionInfo
  {
    public List<Session> Sessions { get; set; }
  }

  public class Camera
  {
    public int CameraNum { get; set; }
    public string CameraName { get; set; }
  }

  public class Group
  {
    public int GroupNum { get; set; }
    public string GroupName { get; set; }
    public List<Camera> Cameras { get; set; }
    public bool? IsScenic { get; set; }
  }

  public class CameraInfo
  {
    public List<Group> Groups { get; set; }
  }

  public class Frequency
  {
    public int FrequencyNum { get; set; }
    public string FrequencyName { get; set; }
    public int Priority { get; set; }
    public int CarIdx { get; set; }
    public int EntryIdx { get; set; }
    public int ClubID { get; set; }
    public int CanScan { get; set; }
    public int CanSquawk { get; set; }
    public int Muted { get; set; }
    public int IsMutable { get; set; }
    public int IsDeletable { get; set; }
  }

  public class Radio
  {
    public int RadioNum { get; set; }
    public int HopCount { get; set; }
    public int NumFrequencies { get; set; }
    public int TunedToFrequencyNum { get; set; }
    public int ScanningIsOn { get; set; }
    public List<Frequency> Frequencies { get; set; }
  }

  public class RadioInfo
  {
    public int SelectedRadioNum { get; set; }
    public List<Radio> Radios { get; set; }
  }

  public class Driver
  {
    public int CarIdx { get; set; }
    public string UserName { get; set; }
    public object AbbrevName { get; set; }
    public object Initials { get; set; }
    public int UserID { get; set; }
    public int TeamID { get; set; }
    public string TeamName { get; set; }
    public string CarNumber { get; set; }
    public int CarNumberRaw { get; set; }
    public string CarPath { get; set; }
    public int CarClassID { get; set; }
    public int CarID { get; set; }
    public int CarIsPaceCar { get; set; }
    public int CarIsAI { get; set; }
    public string CarScreenName { get; set; }
    public string CarScreenNameShort { get; set; }
    public object CarClassShortName { get; set; }
    public int CarClassRelSpeed { get; set; }
    public int CarClassLicenseLevel { get; set; }
    public string CarClassMaxFuelPct { get; set; }
    public string CarClassWeightPenalty { get; set; }
    public int CarClassColor { get; set; }
    public int IRating { get; set; }
    public int LicLevel { get; set; }
    public int LicSubLevel { get; set; }
    public string LicString { get; set; }
    public int LicColor { get; set; }
    public int IsSpectator { get; set; }
    public string CarDesignStr { get; set; }
    public string HelmetDesignStr { get; set; }
    public string SuitDesignStr { get; set; }
    public string CarNumberDesignStr { get; set; }
    public int CarSponsor_1 { get; set; }
    public int CarSponsor_2 { get; set; }
    public int CurDriverIncidentCount { get; set; }
    public int TeamIncidentCount { get; set; }
  }

  public class DriverInfo
  {
    public int DriverCarIdx { get; set; }
    public int DriverUserID { get; set; }
    public int PaceCarIdx { get; set; }
    public double DriverHeadPosX { get; set; }
    public int DriverHeadPosY { get; set; }
    public double DriverHeadPosZ { get; set; }
    public int DriverCarIdleRPM { get; set; }
    public int DriverCarRedLine { get; set; }
    public double DriverCarFuelKgPerLtr { get; set; }
    public double DriverCarFuelMaxLtr { get; set; }
    public int DriverCarMaxFuelPct { get; set; }
    public int DriverCarSLFirstRPM { get; set; }
    public int DriverCarSLShiftRPM { get; set; }
    public int DriverCarSLLastRPM { get; set; }
    public int DriverCarSLBlinkRPM { get; set; }
    public double DriverPitTrkPct { get; set; }
    public double DriverCarEstLapTime { get; set; }
    public string DriverSetupName { get; set; }
    public int DriverSetupIsModified { get; set; }
    public string DriverSetupLoadTypeName { get; set; }
    public int DriverSetupPassedTech { get; set; }
    public int DriverIncidentCount { get; set; }
    public List<Driver> Drivers { get; set; }
  }

  public class Sector
  {
    public int SectorNum { get; set; }
    public double SectorStartPct { get; set; }
  }

  public class SplitTimeInfo
  {
    public List<Sector> Sectors { get; set; }
  }

  public class LeftFront
  {
    public string ColdPressure { get; set; }
    public string LastHotPressure { get; set; }
    public string LastTempsOMI { get; set; }
    public string TreadRemaining { get; set; }
  }

  public class LeftRear
  {
    public string ColdPressure { get; set; }
    public string LastHotPressure { get; set; }
    public string LastTempsOMI { get; set; }
    public string TreadRemaining { get; set; }
  }

  public class RightFront
  {
    public string ColdPressure { get; set; }
    public string LastHotPressure { get; set; }
    public string LastTempsIMO { get; set; }
    public string TreadRemaining { get; set; }
  }

  public class RightRear
  {
    public string ColdPressure { get; set; }
    public string LastHotPressure { get; set; }
    public string LastTempsIMO { get; set; }
    public string TreadRemaining { get; set; }
  }

  public class Tires
  {
    public LeftFront LeftFront { get; set; }
    public LeftRear LeftRear { get; set; }
    public RightFront RightFront { get; set; }
    public RightRear RightRear { get; set; }
  }

  public class Front
  {
    public int ArbArms { get; set; }
    public string ArbDiameter { get; set; }
    public string BrakeBias { get; set; }
    public string ToeIn { get; set; }
    public int SteeringRatio { get; set; }
    public string CrossWeight { get; set; }
  }

  public class LeftFront2
  {
    public string CornerWeight { get; set; }
    public string RideHeight { get; set; }
    public string ShockDeflection { get; set; }
    public string SpringPerchOffset { get; set; }
    public string SpringRate { get; set; }
    public string BumpStiffness { get; set; }
    public string ReboundStiffness { get; set; }
    public string Camber { get; set; }
    public string Caster { get; set; }
  }

  public class LeftRear2
  {
    public string CornerWeight { get; set; }
    public string RideHeight { get; set; }
    public string ShockDeflection { get; set; }
    public string SpringPerchOffset { get; set; }
    public string SpringRate { get; set; }
    public string BumpStiffness { get; set; }
    public string ReboundStiffness { get; set; }
    public string Camber { get; set; }
  }

  public class RightFront2
  {
    public string CornerWeight { get; set; }
    public string RideHeight { get; set; }
    public string ShockDeflection { get; set; }
    public string SpringPerchOffset { get; set; }
    public string SpringRate { get; set; }
    public string BumpStiffness { get; set; }
    public string ReboundStiffness { get; set; }
    public string Camber { get; set; }
    public string Caster { get; set; }
  }

  public class RightRear2
  {
    public string CornerWeight { get; set; }
    public string RideHeight { get; set; }
    public string ShockDeflection { get; set; }
    public string SpringPerchOffset { get; set; }
    public string SpringRate { get; set; }
    public string BumpStiffness { get; set; }
    public string ReboundStiffness { get; set; }
    public string Camber { get; set; }
  }

  public class Rear
  {
    public string FuelLevel { get; set; }
    public string ArbDiameter { get; set; }
    public int ArbArms { get; set; }
    public string ToeIn { get; set; }
  }

  public class Chassis
  {
    public Front Front { get; set; }
    public LeftFront2 LeftFront { get; set; }
    public LeftRear2 LeftRear { get; set; }
    public RightFront2 RightFront { get; set; }
    public RightRear2 RightRear { get; set; }
    public Rear Rear { get; set; }
  }

  public class Transmission
  {
    public double FinalDrive { get; set; }
    public double FirstGear { get; set; }
    public double SecondGear { get; set; }
    public double ThirdGear { get; set; }
    public double FourthGear { get; set; }
    public double FifthGear { get; set; }
  }

  public class Differential
  {
    public int ClutchPlates { get; set; }
    public string Preload { get; set; }
    public string DriveRampAngle { get; set; }
    public string CoastRampAngle { get; set; }
  }

  public class Drivetrain
  {
    public Transmission Transmission { get; set; }
    public Differential Differential { get; set; }
  }

  public class CarSetup
  {
    public int UpdateCount { get; set; }
    public Tires Tires { get; set; }
    public Chassis Chassis { get; set; }
    public Drivetrain Drivetrain { get; set; }
  }

  public class Data
  {
    public WeekendInfo WeekendInfo { get; set; }
    public SessionInfo SessionInfo { get; set; }
    public CameraInfo CameraInfo { get; set; }
    public RadioInfo RadioInfo { get; set; }
    public DriverInfo DriverInfo { get; set; }
    public SplitTimeInfo SplitTimeInfo { get; set; }
    public CarSetup CarSetup { get; set; }
  }

  public class ISession
  {
    public DateTime timestamp { get; set; }
    public Data data { get; set; }
  }
}