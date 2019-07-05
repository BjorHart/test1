PShape base, shoulder, upArm, loArm, end;
float rotX, rotY;
float posX=1, posY=50, posZ=50;
float alpha, beta, gamma;

import processing.serial.*;

Serial  myPort;
short   portIndex = 0; // Index of serial port in list (varies by computer)
int     lf = 10;       //ASCII linefeed
String  inString;      //String for testing serial communication

// Data from CMP12 and complementary filters
float CMP2[] = new float[3];
float CMP1[] = new float[3];

float[] Xsphere = new float[99];
float[] Ysphere = new float[99];
float[] Zsphere = new float[99];

void setup(){
    size(1200, 800, OPENGL);
    
    base = loadShape("r5.obj");
    shoulder = loadShape("r1.obj");
    upArm = loadShape("r2.obj");
    loArm = loadShape("r3.obj");
    end = loadShape("r4.obj");
    
    shoulder.disableStyle();
    upArm.disableStyle();
    loArm.disableStyle(); 
    
     String portName = Serial.list()[portIndex];
    //  println(Serial.list());
    //  println(" Connecting to -> " + Serial.list()[portIndex]);
    myPort = new Serial(this, portName, 57600);
    myPort.clear();
    myPort.bufferUntil(lf);
    
    
}

void draw(){ 
   writePos();
   background(32);
   smooth();
   lights(); 
   directionalLight(51, 102, 126, -1, 0, 0);
    
    for (int i=0; i< Xsphere.length - 1; i++) {
    Xsphere[i] = Xsphere[i + 1];
    Ysphere[i] = Ysphere[i + 1];
    Zsphere[i] = Zsphere[i + 1];
    }
    
    Xsphere[Xsphere.length - 1] = posX;
    Ysphere[Ysphere.length - 1] = posY;
    Zsphere[Zsphere.length - 1] = posZ;
   
   noStroke();
   
   translate(width/2,height/2);
   rotateX(rotX);
   rotateY(-rotY);
   scale(-4);
   
   
    
   fill(#FFE308);  
   translate(0,-40,0);   
     shape(base);
     
   translate(0, 4, 0);
   rotateY(-radians(CMP2[0]));
     shape(shoulder);
      
   translate(0, 25, 0);
   rotateY(PI);
   rotateX(-radians(CMP2[1]));  // multiplied with offset factor to make model better
     shape(upArm);
      
   translate(0, 0, 50);
   rotateY(PI);
   rotateX(radians(CMP1[1])); // multiplied with offset factor to make model better
     shape(loArm);
      
   translate(0, 0, -50);
   rotateY(0);
     shape(end);
}

void mouseDragged(){
    rotY -= (mouseX - pmouseX) * 0.01;
    rotX -= (mouseY - pmouseY) * 0.01;
}

/*
 *  Read and process data from the serial port
 */
void serialEvent(Serial p) {
  inString = myPort.readString();
  
  try {
    // Parse the data
    //println(inString);
    String[] dataStrings = split(inString, ':');
    if (dataStrings.length == 4) {
      if (dataStrings[0].equals("CMP1")) {
        for (int i = 0; i < dataStrings.length - 1; i++) {
          CMP1[i] = float(dataStrings[i+1]);
        }
      } else if (dataStrings[0].equals("CMP2")) {
        for (int i = 0; i < dataStrings.length - 1; i++) {
          CMP2[i] = float(dataStrings[i+1]);
        }        
      } else {
        println(inString);
      }
    }
  } catch (Exception e) {
    println("Caught Exception");
  }
  
}
