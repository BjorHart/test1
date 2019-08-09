 #include <avr/wdt.h> 
 /*
 void setup() {
  
  wdt_disable(); 
  
  //         bootloop 
  Serial.begin(9600);
  Serial.println("Setup..");
  Serial.println("Wait 5 sec..");
  delay(5000); 
  //         bootloop 
  wdt_enable (WDTO_8S);
  //   
  Serial.println("Watchdog enabled.");
  }
  int timer = 0; 
  
  void loop(){
    //          Serial 
    if(!(millis()%1000)) {
      timer++; 
      Serial.println(timer);
      digitalWrite(13, digitalRead(13)==1?0:1); 
      delay(1);
      } 
   
   // wdt_reset();
   } 
 */


void setup() {
  Serial.begin(9600);
  MCUSR = 0;
  wdt_disable();
  digitalWrite(13, 1);
  delay(4000);
  Serial.println("Setup");
  wdt_enable(WDTO_1S);
  
}

void loop() {
  digitalWrite(13, 0);
    for (int i = 0; i < 100; i++) {
      delay(100*i);
      wdt_reset();
      Serial.println(100*i);
    }
    
    
}
