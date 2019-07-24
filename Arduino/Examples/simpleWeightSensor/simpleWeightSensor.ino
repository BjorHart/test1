// Need to install the libary HX711_ADC by Olav Kallhovd 
#include <HX711_ADC.h> 
HX711_ADC LoadCell(4, 5); // parameters: dt pin, sck pin

void setup() {
  LoadCell.begin(); // start connection to HX711
  LoadCell.start(2000); // load cells gets 2000ms of time to stabilize
  LoadCell.setCalFactor(385); // calibration factor for load cell => Already calibrated to work in Sandvika (without robotic arm)
}
void loop() {
  LoadCell.update(); // Get data from load cell
  float i = LoadCell.getData(); // get output value
  Serial.println(i); // print out the value to serial monitor
}
