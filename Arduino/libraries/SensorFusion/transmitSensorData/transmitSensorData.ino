
#include <avr/wdt.h>


void setup() {
  Serial.println("HEI");
  weightSensorSetup();
  rotationSensorSetup();
  MQTTSetup();
  wdt_enable(WDTO_1S);
}

void loop() {
  /*
  Serial.print(potSensorUpdate(0));
  Serial.print(": ");
  Serial.print(potSensorUpdate(1));
  Serial.print(": ");
  Serial.print(potSensorUpdate(2));
  Serial.print(": ");
  Serial.print(weightSensorUpdate());
  Serial.print(": ");
  Serial.print(rotSensorUpdate());

*/
 wdt_reset();
 int a = rotSensorUpdate();
 MQTTSend(potSensorUpdate(0), potSensorUpdate(1), potSensorUpdate(2), weightSensorUpdate(), a);
 while(1) {
  //
 }
}
