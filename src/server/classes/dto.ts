export class Dto {
  public "values":
    {
      "Throttle": number,
      "Brake": number,
      "SteeringWheelAngle": number,
      "CarIdxLap": number[],
      "CarIdxLapCompleted": number[],
      "CarIdxLapDistPct": number[],
      "CarIdxTrackSurface": string[],
      "CarIdxOnPitRoad": boolean[],
      "CarIdxPosition": number[],
      "CarIdxClassPosition": number[],
      "CarIdxF2Time": number[],
      "CarIdxEstTime": number[],
      "SessionTime": number,
      "SessionTimeRemain": number,
    };

  constructor() {
    this.values = {
      "Throttle": 0,
      "Brake": 0,
      "SteeringWheelAngle": 0,
      "CarIdxLap": [],
      "CarIdxLapCompleted": [],
      "CarIdxLapDistPct": [],
      "CarIdxTrackSurface": [],
      "CarIdxOnPitRoad": [],
      "CarIdxPosition": [],
      "CarIdxClassPosition": [],
      "CarIdxF2Time": [],
      "CarIdxEstTime": [],
      "SessionTime": 0,
      "SessionTimeRemain": 0,
    };
  }
}
