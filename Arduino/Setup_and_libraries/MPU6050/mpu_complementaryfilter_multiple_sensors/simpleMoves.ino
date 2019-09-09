
/*
  simpleMoves.ino

 This sketch shows how to move the Braccio to different positions

 Created 01012019
 by Stefan Strömberg

 This example is in the public domain.
 */

#include <BraccioRobot.h>
#include <Servo.h>


Position pos;

void loop() {
  // Set the position
  // M1=base degrees. Allowed values from 0 to 180 degrees
  // M2=shoulder degrees. Allowed values from 15 to 165 degrees
  // M3=elbow degrees. Allowed values from 0 to 180 degrees
  // M4=wrist degrees. Allowed values from 0 to 180 degrees
  // M5=wrist rotation degrees. Allowed values from 0 to 180 degrees
  // M6=gripper degrees. Allowed values from 10 to 73 degrees. 10: the toungue is open, 73: the gripper is closed.

  GetMpuValue1(MPU1);

  GetMpuValue2(MPU2);

  
  //     (M1,  M2,  M3,  M4, M5,  M6)
 // pos.set( 0,  90, 90, 90,  0,  73);

  // Move the robot to the position 5with a specified speed between 20-200 degrees per second
//  BraccioRobot.moveToPosition(pos, 50);  

  //Wait 1 second
delay(200);
  // Move the robot to a new position with speed 50 degrees per second. 
  // Note that you can set the position at the same time as you use it
 // BraccioRobot.moveToPosition(pos.set(0, 0, 0, 90, 0, 73), 50);  

  //Wait 1 second
}
