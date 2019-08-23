
#include <avr/wdt.h>


void setup() {
  Serial.begin(9600); // May be removed

  // When restarting, maybe send data to robot arm to start initialization over again
  Serial.println("Setup");
  //Watchdog routing
 // MCUSR = 0;
// wdt_disable();
  digitalWrite(13, 1); // LED ON indicating setup procedure
  delay(1000);
// wdt_enable(WDTO_4S);
  
  weightSensorSetup();
  rotationSensorSetup();
  MQTTSetup();
  
}

void loop() {

 digitalWrite(13, 0); // LED OFF indicating in loop
 int a = rotationSensorUpdate();
 //MQTTSend(potSensorUpdate(0), potSensorUpdate(1), potSensorUpdate(2), weightSensorUpdate(), a);
 Serial.println(a);
//wdt_reset(); // If sending takes more than 1 second, the program is restarted, indicating a crash most likely in the 6-axis sensor
}
