
#include <avr/wdt.h>


void setup() {
  Serial.println("SETUP");
  weightSensorSetup();
  rotationSensorSetup();
  MQTTSetup();
  wdt_enable(WDTO_1S);
}

void loop() {
 
 wdt_reset();
 int a = rotSensorUpdate();
 MQTTSend(potSensorUpdate(0), potSensorUpdate(1), potSensorUpdate(2), weightSensorUpdate(), a);

}
