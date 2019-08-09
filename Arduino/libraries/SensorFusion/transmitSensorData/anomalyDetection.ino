

int anomalyDetect() {

  if (abs(robotArmPos - sensorValue) > 20) {
    // Difference between desired robot position and sensor value
    // is(probably) larger than 20 degrees.
    // Do something
  }
  
}


int robotArmPos(int part) {
  return 0;
}


int sensorValue(int sensor) {
  return 0;
}
