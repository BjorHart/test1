


/*
  Braccio extreme movements

 Dette er ein kode som viser kva Braccio arm kan klare å gjere.

 skapt den 21. sept 2017
 av Sander Ringmo Fylkesnes

 */

#include <Braccio.h>
#include <Servo.h>

Servo base;
Servo shoulder;
Servo elbow;
Servo wrist_rot;
Servo wrist_ver;
Servo gripper;

void setup() {
  //Initialization functions and set up the initial position for Braccio
  //All the servo motors will be positioned in the "safety" position:
  //Base (M1):90 degrees
  //Shoulder (M2): 45 degrees
  //Elbow (M3): 180 degrees
  //Wrist vertical (M4): 180 degrees
  //Wrist rotation (M5): 90 degrees
  //gripper (M6): 10 degrees
  Braccio.begin();
}

void loop() {
   /*
   Step Delay: a milliseconds delay between the movement of each servo.  Allowed values from 10 to 30 msec.
   M1=base degrees. Allowed values from 0 to 180 degrees
   M2=shoulder degrees. Allowed values from 15 to 165 degrees
   M3=elbow degrees. Allowed values from 0 to 180 degrees
   M4=wrist vertical degrees. Allowed values from 0 to 180 degrees
   M5=wrist rotation degrees. Allowed values from 0 to 180 degrees
   M6=gripper degrees. Allowed values from 10 to 73 degrees. 10: the toungue is open, 73: the gripper is closed.
  */
  
  /* her begynner danse movents (uferdig) */
                       //(step delay, M1, M2, M3, M4, M5, M6);
  Braccio.ServoMovement(20,           90,  90, 160, 270, 30,  90);  

  //Wait 1 second
  delay(1000);

  Braccio.ServoMovement(20,           70, 60 , 50, 0, 180,  20);  

  //Wait 1 second
  delay(500);

 Braccio.ServoMovement(10,            200,  300, 60,50, 200, 30);
 delay(300);
 
 Braccio.ServoMovement(10,           200,  400, 60,50, 200,  10);
 delay(500);
 
 Braccio.ServoMovement(20,           60,  65,  35, 50, 90, 73);
 delay(230);
 
 /* her begynner klappe movements*/
 Braccio.ServoMovement(10,           60,  65,  70,  50, 90, 0);
 delay(5);
 
 Braccio.ServoMovement(5,           60,  65,  70,  50, 90, 73);
 delay(5);
 
 Braccio.ServoMovement(5,           60,  65,  70,  50, 90,    0);
 delay(5);
 
 Braccio.ServoMovement(5,           60, 65,   70,  50, 90,    73);
 delay(5);
 
  Braccio.ServoMovement(10,           60,  65,  70,  50, 90, 0);
 delay(5);

 Braccio.ServoMovement(5,           60, 65,   70,  50, 90,    73);
 delay(5);

 Braccio.ServoMovement(10,           60,  65,  70,  50, 90, 0);
 delay(5);
 

 /*Her begynner slange movements (uferdig)*/
 Braccio.ServoMovement(5,           90,  45, 180,   0, 90,    73);
 delay(500);
 Braccio.ServoMovement(5,           90,   45, 90 ,  90,  90,   0);
 delay(5000);  
}
