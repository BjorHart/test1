/*
    src.ino
    Written by Paal Arthur Schjelderup Thorseth - 28.06.2019

    todo text here

 */

#include "readPotAngle.h"

void setup(){
    Serial.begin(9600);
}

void loop(){

  readPotAngle(A0);
  delay(1000);

    // Set the position
  
  // M1=base degrees. Allowed values from 0 to 180 degrees
  // M2=shoulder degrees. Allowed values from 15 to 165 degrees
  // M3=elbow degrees. Allowed values from 0 to 180 degrees
  // M4=wrist degrees. Allowed values from 0 to 180 degrees
  // M5=wrist rotation degrees. Allowed values from 0 to 180 degrees
  // M6=gripper degrees. Allowed values from 10 to 73 degrees. 10: the toungue is open, 73: the gripper is closed.
  //     (M1,  M2,  M3,  M4, M5,  M6)
  pos.set( 0,  15, 180, 170,  0,  73);

  // Move the robot to the position with a specified speed between 20-200 degrees per second
  BraccioRobot.moveToPosition(pos, 100);  

  //Wait 1 second
  delay(5000);

  // Move the robot to a new position with speed 50 degrees per second. 
  // Note that you can set the position at the same time as you use it
  BraccioRobot.moveToPosition(pos.set(180,  165, 0, 0, 180,  10), 50);  

  //Wait 1 second
  delay(5000);

}
