#include <BraccioRobot.h>
#include <Servo.h>

void setup() {
  //init() will start the robot and move to the initial position, which is:
  //Base     (M1): 90 degrees
  //Shoulder (M2): 90 degrees
  //Elbow    (M3): 90 degrees
  //Wrist    (M4): 90 degrees
  //Wrist rot(M5): 90 degrees
  //gripper  (M6): 72 degrees
  //The initial position can be changed by supplying a Position as a parameter
  //to init() 
  BraccioRobot.init();
}

Position pos;

void loop() {
  // Set the position
  // M1=base degrees. Allowed values from 0 to 180 degrees
  // M2=shoulder degrees. Allowed values from 15 to 165 degrees
  // M3=elbow degrees. Allowed values from 0 to 180 degrees
  // M4=wrist degrees. Allowed values from 0 to 180 degrees
  // M5=wrist rotation degrees. Allowed values from 0 to 180 degrees
  // M6=gripper degrees. Allowed values from 10 to 73 degrees. 10: the toungue is open, 73: the gripper is closed.
  //     (M1,  M2,  M3,  M4, M5,  M6)
  //pos.set( 142, 85 , 80, 97,  90,  73);

  // Move the robot to the position with a specified speed between 20-200 degrees per second
  BraccioRobot.moveToPosition(pos.set( 142, 85 , 80, 97,  90,  73), 15);  
  delay(300);
  BraccioRobot.moveToPosition(pos.set(142, 85, 176,176,90,10), 15);
  delay(500);
  BraccioRobot.moveToPosition(pos.set(142, 85, 176,176,90,73), 15); 
  delay(500);
  BraccioRobot.moveToPosition(pos.set(142,75,4,8,90,73), 15);  
  delay(500);
  BraccioRobot.moveToPosition(pos.set(142,75,4,8,90,10), 15);  
  delay(600);
  //BraccioRobot.moveToPosition(pos.set(,90,90,90,50,10), 15);  
  //Wait 1 second
  BraccioRobot.moveToPosition(pos.set(142,85,80,97,90,10), 15);  
  delay(2000);
  BraccioRobot.moveToPosition(pos.set(142,75,4,8,90,10), 15);  
  delay(500);
  BraccioRobot.moveToPosition(pos.set(142, 75, 4,8,90,73), 15);
  delay(500);
  BraccioRobot.moveToPosition(pos.set(142, 85, 176,176,90,73), 15);
  delay(500);
  BraccioRobot.moveToPosition(pos.set(142, 85, 176,176,90,10), 15);
  delay(500);
}
