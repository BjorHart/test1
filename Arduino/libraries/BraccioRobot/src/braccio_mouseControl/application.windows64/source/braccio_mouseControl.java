import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import processing.serial.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class braccio_mouseControl extends PApplet {



float boxX;
float boxY;
float boxyX;
float boxyY;
int boxSize = 20;
boolean mouseOverBox = false;

Serial myPort;

public void setup() {
  
  int height = 200;
  int width = 200;
  String portName = Serial.list()[0];
  myPort = new Serial(this, portName, 9600);
  boxX = 140;
  boxY = 100;
  
  boxyX = 60;
  boxyY = 100;
 
}

public void draw() {
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
  public void settings() {  size(200, 200, OPENGL); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "braccio_mouseControl" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
