export class Dto {
  "values":
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
    };
  }
}