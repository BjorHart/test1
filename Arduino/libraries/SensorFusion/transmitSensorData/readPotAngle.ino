

int potSensorUpdate(int POTPIN){
    return map(analogRead(POTPIN), 0, 1023, 0, 180); // convert sensorValue to angle
}