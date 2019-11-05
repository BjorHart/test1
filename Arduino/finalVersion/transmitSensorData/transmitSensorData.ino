//#include <avr/wdt.h>
Include MQTT_JSON;


void setup() {
  Serial.begin(115200); // May be removed
  
  //Watchdog routing
  //MCUSR = 0;
  //wdt_disable();
  //digitalWrite(13, 1); // LED ON indicating setup procedure
  //delay(1000);
  //Serial.println("SETUP");
  //wdt_enable(WDTO_1S);
  
  weightSensorSetup();
  MQTTSetup();
  //rotationSensorSetup();
  MQTTSetup();
  
}

void loop() {
 int lower = (potSensorUpdate(0)+3)*1.43;
 int middle = (potSensorUpdate(1))*1.43;
 int upper = (potSensorUpdate(2)-4)*1.43;
 //digitalWrite(13, 0);
 int a = 45;
 //rotSensorUpdate();
 MQTTSend(lower, middle, upper, weightSensorUpdate(), a);
 //MQTTSend(potSensorUpdate(0), potSensorUpdate(1), potSensorUpdate(2), weightSensorUpdate(), a);
 Serial.println(weightSensorUpdate());
 //wdt_reset(); // If sending takes more than 1 second, the program is restarted, indicating a crash most likely in the 6-axis sensor
}
