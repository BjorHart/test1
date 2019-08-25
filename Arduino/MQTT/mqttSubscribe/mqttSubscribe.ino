#include <BridgeClient.h>
#include <PubSubClient.h>
#include <BraccioRobot.h>
#include <Servo.h>

char const *inTopic = "Program";

#define MQTT_SERVER "195.159.164.54"

#define MQTT_CLIENTID "Yun_Sandvika"


String value = "pgram";
String msg = "";

void callback(char* topic, byte* payload, unsigned int length) {
   msg = (char*)payload;
   value = msg;
}

BridgeClient yun;
PubSubClient mqtt(MQTT_SERVER, 1883, callback, yun);

void setup()
{
  Serial.begin(9600);
  Bridge.begin();
  if (mqtt.connect(MQTT_CLIENTID)) {
    mqtt.subscribe(inTopic);
  }
  BraccioRobot.init();
}

void loop(){
  mqtt.loop();
  //Serial.println(value);
  if (value == "pgram"){
    pause();
  }
  else if (value == "hgram"){
    program4();
   }
  else if (value == "agram"){
    program1();
  }
  else if (value == "bgram"){
    program2();
  }
  else if (value == "cgram"){
    program3();
  }
 }
 
Position pos;

void program1(){
  //While true En verdi kan da breake ut
  Serial.println("Program: Pick up box");
  BraccioRobot.moveToPosition(pos.set( 154, 85 , 80, 97,  90,  73), 15);
  mqtt.loop();
  if (value == "agram"){
    delay(300);
  }
  else {
    loop();
    ////break;
  }
  BraccioRobot.moveToPosition(pos.set(154, 85, 178,178,90,10), 15);
  mqtt.loop();
  if (value == "agram"){
    delay(500);
  }
  else {
    loop();
    ////break;
  }
  BraccioRobot.moveToPosition(pos.set(154, 85, 178,178,90,73), 15); 
  mqtt.loop();
  if (value == "agram"){
    delay(500);
  }
  else {
    loop();
    ////break;
  }
  BraccioRobot.moveToPosition(pos.set(154,75,4,8,90,73), 15);  
  mqtt.loop();
  if (value == "agram"){
    delay(500);
  }
  else {
    loop();
    ////break;
  }
  BraccioRobot.moveToPosition(pos.set(154,75,4,8,90,10), 15);
  mqtt.loop();
  if (value == "agram"){
    delay(500);
  }
  else {
    loop();
    ////break;
  }
  BraccioRobot.moveToPosition(pos.set(154,85,80,97,90,10), 15);  
  mqtt.loop();
  if (value == "agram"){
    delay(2000);
  }
  else {
    loop();
    //break;
  }
  BraccioRobot.moveToPosition(pos.set(154,75,4,8,90,10), 15); 
  mqtt.loop();
  if (value == "agram"){
    delay(500);
  }
  else {
    loop();
    //break;
  } 
  BraccioRobot.moveToPosition(pos.set(154, 75, 4,8,90,73), 15);
  mqtt.loop();
  if (value == "agram"){
    delay(500);
  }
  else {
    loop();
    //break;
  }
  BraccioRobot.moveToPosition(pos.set(154, 85, 178,178,90,73), 15);
  mqtt.loop();
  if (value == "agram"){
    delay(500);
  }
  else {
    loop();
    //break;
    
  }
  BraccioRobot.moveToPosition(pos.set(154, 85, 178,178,90,10), 15);
  mqtt.loop();
  if (value == "agram"){
    delay(500);
  }
  else {
    loop();
    ////break;
  }
}

void pause(){
   Serial.println("PAUSE");
   BraccioRobot.moveToPosition(pos.set(154, 85,80,97,90,73), 15);
   mqtt.loop();
   if (value == "pgram"){
    delay(1000);
  }
  else {
   loop();
   //////break;
  }
}

void program2(){
  Serial.println("Program: Braccio flex");
  BraccioRobot.moveToPosition(pos.set( 154, 85 , 80, 97,  90,  73), 40);
  mqtt.loop();
  if (value == "bgram"){
    delay(300);
  }
  else {
    loop();
  }   
  BraccioRobot.moveToPosition(pos.set(154, 55, 110,97,90,73), 40);
  mqtt.loop();
  if (value == "bgram"){
    delay(100);
  }
  else {
    loop();
  } 
  BraccioRobot.moveToPosition(pos.set(154, 55, 110,180,90,73), 40);
  mqtt.loop();
  if (value == "bgram"){
    delay(300);
  }
  else {
    loop();
  }  
  BraccioRobot.moveToPosition(pos.set(154,55,130,180,90,73), 40);
  mqtt.loop();
  if (value == "bgram"){
    delay(500);
  }
  else {
    loop();
  }   
  BraccioRobot.moveToPosition(pos.set(154,55,130,85,90,73), 40);  
  mqtt.loop();
  if (value == "bgram"){
    delay(100);
  }
  else {
    loop();
  } 
  BraccioRobot.moveToPosition(pos.set(154,120,60,80,90,73), 40);
  mqtt.loop();
  if (value == "bgram"){
    delay(500);
  }
  else {
    loop();
  }   
  BraccioRobot.moveToPosition(pos.set(154,150,25,30,90,73), 40);
  mqtt.loop();
  if (value == "bgram"){
    delay(500);
  }
  else {
    loop();
  }   
  BraccioRobot.moveToPosition(pos.set(154, 160, 0,0,90,73), 40);
  mqtt.loop();
  if (value == "bgram"){
    delay(2000);
  }
  else {
    loop();
  } 
  BraccioRobot.moveToPosition(pos.set(154, 130,50,75,90,73), 40);
  mqtt.loop();
  if (value == "bgram"){
    delay(100);
  }
  else {
    loop();
  } 
  BraccioRobot.moveToPosition(pos.set(154,100,150,160,90,73), 40);
  mqtt.loop();
  if (value == "bgram"){
    delay(400);
  }
  else {
    loop();
  }   
  BraccioRobot.moveToPosition(pos.set(154,85,110,175,90,73), 40);  
  mqtt.loop();
  if (value == "bgram"){
    delay(100);
  }
  else {
    loop();
  } 
  BraccioRobot.moveToPosition(pos.set(154,85,80,97,90,73), 40);
  mqtt.loop();
  if (value == "bgram"){
    delay(100);
  }
  else {
    loop();
  } 
  BraccioRobot.moveToPosition(pos.set(154,85,180,0,90,73), 40);
  mqtt.loop();
  if (value == "bgram"){
    delay(500);
  }
  else {
    loop();
  } 
  BraccioRobot.moveToPosition(pos.set(154,85,180,97,90,73), 40);
  mqtt.loop();
  if (value == "bgram"){
    delay(200);
  }
  else {
    loop();
  } 
  BraccioRobot.moveToPosition(pos.set(154,85,80,180,90,73), 40);
  mqtt.loop();
  if (value == "bgram"){
    delay(100);
  }
  else {
    loop();
  } 
  BraccioRobot.moveToPosition(pos.set(154,85,80,97,90,73), 40);
  mqtt.loop();
  if (value == "bgram"){
    delay(100);
  }
  else {
    loop();
  } 
}

void program3(){
  Serial.println("Program: Braccio rotation");
  BraccioRobot.moveToPosition(pos.set( 154, 85 , 80, 97,  90,  73), 25);
  mqtt.loop();
  if (value == "cgram"){
    delay(300);
  }
  else {
    loop();
  }   
  BraccioRobot.moveToPosition(pos.set(50, 85, 80,97,90,10), 25);
  mqtt.loop();
  if (value == "cgram"){
    delay(500);
  }
  else {
    loop();
  }  
  BraccioRobot.moveToPosition(pos.set(50, 85, 180,97,90,73), 25);
  mqtt.loop();
  if (value == "cgram"){
    delay(300);
  }
  else {
    loop();
  }   
  BraccioRobot.moveToPosition(pos.set(180,85,180,10,90,73), 25);
  mqtt.loop();
  if (value == "cgram"){
    delay(10);
  }
  else {
    loop();
  }    
  BraccioRobot.moveToPosition(pos.set(154,150,10,10,90,73), 25);  
  mqtt.loop();
  if (value == "cgram"){
    delay(600);
  }
  else {
    loop();
    
  }  
  BraccioRobot.moveToPosition(pos.set(50,150,10,10,90,73), 25); 
  mqtt.loop();
  if (value == "cgram"){
    delay(2000);
  }
  else {
    loop();
  }   
  BraccioRobot.moveToPosition(pos.set(50,85,80,97,90,73),25 );  
  mqtt.loop();
  if (value == "cgram"){
    delay(500);
  }
  else {
    loop();
  }  
  BraccioRobot.moveToPosition(pos.set(154,85,50,97,90,73), 25);
  mqtt.loop();
  if (value == "cgram"){
    delay(500);
  }
  else {
    loop();
  }  
  BraccioRobot.moveToPosition(pos.set(154,85,180,0,90,73), 25);
  mqtt.loop();
  if (value == "cgram"){
    delay(2);
  }
  else {
    loop();
  }  
  BraccioRobot.moveToPosition(pos.set(50, 85, 180,0,90,73), 25);
  mqtt.loop();
  if (value == "cgram"){
    delay(2);
  }
  else {
    loop();
  }  
  BraccioRobot.moveToPosition(pos.set(180,85,180,0,90,73), 25);
  mqtt.loop();
  if (value == "cgram"){
    delay(2);
  }
  else {
    loop();
  }  
  BraccioRobot.moveToPosition(pos.set(50, 85, 180,0,90,73), 25);
  mqtt.loop();
  if (value == "cgram"){
    delay(2);
  }
  else {
    loop();
  }  
  BraccioRobot.moveToPosition(pos.set(154,85,80,97,90,73), 25);
  mqtt.loop();
  if (value == "cgram"){
    delay(300);
  }
  else {
    loop();
  }  
}

void program4(){
  Serial.println("Program: Braccio Holo");
  BraccioRobot.moveToPosition(pos.set( 154, 85 ,81, 0, 90, 72), 25);  
  mqtt.loop();
  if (value == "hgram"){
  delay(500);
  }
  else {
    loop();
  }
}
