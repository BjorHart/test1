int incomingByte = 0; // for incoming serial data
int angle = 90;
#include "BraccioRobot.h"
#include <Arduino.h>

Position pos;

void setup() {

 BraccioRobot.init();
}

void loop() {
 // Serial.println(keyboardInput());
  controlMiddleServo();
}

int keyboardInput() {

  // send data only when you receive data:
  if (Serial.available() > 0) {
    // read the incoming byte:
    incomingByte = Serial.read();
  }
  return incomingByte;
  
}


void controlMiddleServo() {
  
    // q = 113
    // w = 119
    int move_dir = keyboardInput(); 
    if (move_dir == 'H') {
      angle++;
      Serial.println(angle);
    }
    else if (move_dir == 'L') {
      angle--;
      Serial.println(angle);
    }
    else {
     // do nothing
    }
    BraccioRobot.moveToPosition(pos.set(90, 90, angle, 90, 90, 72), 100);
  
}
