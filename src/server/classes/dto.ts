export class Dto 
{ 
  "values":
  { 
    "Throttle": Number,
    "Brake": Number,
    "SteeringWheelAngle": Number 
  }

  constructor(){
    this.values = {
      "Throttle": 0,
      "Brake": 0,
      "SteeringWheelAngle": 0
    };
  }
}