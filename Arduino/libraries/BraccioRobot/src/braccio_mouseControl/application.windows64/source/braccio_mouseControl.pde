import processing.serial.*;

float boxX;
float boxY;
float boxyX;
float boxyY;
int boxSize = 20;
boolean mouseOverBox = false;

Serial myPort;

void setup() {
  size(200, 200, OPENGL);
  int height = 200;
  int width = 200;
  String portName = Serial.list()[0];
  myPort = new Serial(this, portName, 9600);
  boxX = 140;
  boxY = 100;
  
  boxyX = 60;
  boxyY = 100;
 
}

void draw() {
  background(0);
  if (mouseX > boxX - boxSize && mouseX < boxX + boxSize &&
        mouseY > boxY - boxSize && mouseY < boxY + boxSize) {
      mouseOverBox = true;
      // draw a line around the box and change its color:
      stroke(255);
      fill(153);
      // send an 'H' to indicate mouse is over square:
      myPort.write('H');
     }
  else if  (mouseX > boxyX - boxSize && mouseX < boxyX + boxSize &&
        mouseY > boxyY - boxSize && mouseY < boxyY + boxSize) {
      // return the box to its inactive state:
      stroke(255);
      fill(153);
      // send an 'L' to turn the LED off:
      myPort.write('L');
      mouseOverBox = false;
    }
 else {
  stroke(153);
  fill(153);
 }

    // Draw the box
    rect(boxX, boxY, boxSize, boxSize);
    rect(boxyX, boxyY, boxSize, boxSize);
}
