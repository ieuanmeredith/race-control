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
      "SessionTimeRemain": string,
      "SoC": string,
      "Deploy": string,
      "FuelLevel": string,
      "FuelLapsLeft": string,
      "FuelPerLap": string,
      "Delta": string,
      "BoxBoxBox": boolean,
      "Flags": string[],
      "Gear": string,
      "Temp": string,
      "DeployMode": string,
      "Speed": string
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
      "SessionTimeRemain": "",
      "SoC": "",
      "Deploy": "",
      "FuelLevel": "",
      "FuelLapsLeft": "",
      "FuelPerLap": "",
      "Delta": "",
      "BoxBoxBox": false,
      "Flags": [],
      "Gear": "",
      "Temp": "",
      "DeployMode": "",
      "Speed": ""
    };
  }
}
