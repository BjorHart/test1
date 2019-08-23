//Subscribe function for deciding program
/*
#include <BridgeClient.h>
#include <PubSubClient.h>
#include <ArduinoJson.h> 

char const *inTopic      = "Program"; // * MQTT channel where updates are received

byte server[] = { 195, 159, 164, 54 }; // MQTT server address

//char buffer[256]; ??? Trengs denne

//bool isRunning = true; // true if the robotic arm is running (need to set function for this)
//bool data = true; // true if there is any data recieved from the sensors, will not publish if there is no data. (Need to set function for this)

//long time = 0;

size_t n;

//char* test;

//long randNumber;    
// Yun configuration
byte mac[] = {0xA8, 0x40, 0x41, 0x1A, 0x72, 0x2C}; // MAC adress of the Arduino Yun
BridgeClient yun2;
PubSubClient client;

void callback(char* topic, byte* payload, unsigned int length) {
  // handle message arrived
}

void setup() {

  Bridge.begin();
  client.setClient(yun2);
  client.setServer(server, 1883);  
  brokerConnection();
}
/*
void MQTTSend(int lower, int middle, int upper, int weight, int rotation) {
  

  jsonSerializer(lower,middle,upper,weight, rotation); // Currently used for testinng instead of real sensor data
  if (isRunning) {
    if (data) {
      //brokerPublish("publish");
       client.publish(outTopic, buffer, n);
       
    } else {
    }
    //time = millis();
  }
  
}

// Serializes the given angles and weight to a JSON string 
void jsonSerializer (int lower, int middle, int upper, int weight, int rotation){
  const size_t capacity = JSON_OBJECT_SIZE(5);
  DynamicJsonDocument doc(capacity);
  
  doc["lower"] = lower;
  doc["middle"] = middle;
  doc["upper"] = upper;
  doc["weight"] = weight;
  doc["rotation"] = rotation; 

  size_t n = serializeJson(doc, buffer); //Sends the serialized JSON string to the buffer, also calculates the byte size to optimize number of cpu cycles
  //serializeJson(doc, Serial);
}

//MQTT server connection
void brokerConnection() {
  if (!client.connected()) {
    if (client.connect(inTopic)) {
      brokerSubscribe()
    }
  }
  client.loop();
}
/*
// MQTT publish 
void brokerPublish(char* value) {
  if (value == "publish")
    //client.publish(outTopic, payload); //used for testing
    client.publish(outTopic, buffer, n);
 
}

 
//MQTT subscribe ()
void brokerSubscribe() {
  client.subscribe(inTopic);
}
*/
#include <BridgeClient.h>
#include <PubSubClient.h>
#include <BraccioRobot.h>
#include <Servo.h>

char const *inTopic = "Program";

#define MQTT_SERVER "195.159.164.54"

#define MQTT_CLIENTID "Yun_Sandvika"

char value;
//String data;
void callback(char* topic, byte* payload, unsigned int length) {
  // handle message arrived
   for(int i = 0; i < length; i ++)
  {
    value = char(payload[i]);
    //value = data.toInt();
   }
  //Serial.println(data);
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

void loop()
{
  mqtt.loop();
  if (value == 'p'){
    pause();
  }
  else if (value == 'a'){
    program1();
  }
  else if (value == 'b'){
    program2();
  }
  else if (value == 'c'){
    program3();
  }
}
Position pos;

void program1(){
  Serial.println("Program: Pick up box");
  BraccioRobot.moveToPosition(pos.set( 154, 85 , 80, 97,  90,  73), 15);  
  delay(300);
  BraccioRobot.moveToPosition(pos.set(154, 85, 178,178,90,10), 15);
  delay(500);
  BraccioRobot.moveToPosition(pos.set(154, 85, 178,178,90,73), 15); 
  delay(500);
  BraccioRobot.moveToPosition(pos.set(154,75,4,8,90,73), 15);  
  delay(500);
  BraccioRobot.moveToPosition(pos.set(154,75,4,8,90,10), 15);  
  delay(600);
  BraccioRobot.moveToPosition(pos.set(154,85,80,97,90,10), 15);  
  delay(2000);
  BraccioRobot.moveToPosition(pos.set(154,75,4,8,90,10), 15);  
  delay(500);
  BraccioRobot.moveToPosition(pos.set(154, 75, 4,8,90,73), 15);
  delay(500);
  BraccioRobot.moveToPosition(pos.set(154, 85, 178,178,90,73), 15);
  delay(500);
  BraccioRobot.moveToPosition(pos.set(154, 85, 178,178,90,10), 15);
  delay(500);
}

void pause(){
   Serial.println("PAUSE");
   BraccioRobot.moveToPosition(pos.set(154, 85,80,97,90,73), 15);
   delay(2000);
}
void program2(){
  Serial.println("Program: Braccio flex");
  BraccioRobot.moveToPosition(pos.set( 154, 85 , 80, 97,  90,  73), 40);  
  delay(300);
  BraccioRobot.moveToPosition(pos.set(154, 55, 110,97,90,73), 40);
  delay(100);
  BraccioRobot.moveToPosition(pos.set(154, 55, 110,180,90,73), 40); 
  delay(300);
  BraccioRobot.moveToPosition(pos.set(154,55,130,180,90,73), 40);  
  delay(500);
  BraccioRobot.moveToPosition(pos.set(154,55,130,85,90,73), 40);  
  delay(100);
  BraccioRobot.moveToPosition(pos.set(154,120,60,80,90,73), 40);  
  delay(500);
  BraccioRobot.moveToPosition(pos.set(154,150,25,30,90,73), 40);  
  delay(500);
  BraccioRobot.moveToPosition(pos.set(154, 160, 0,0,90,73), 40);//plukker opp
  delay(2000);
  BraccioRobot.moveToPosition(pos.set(154, 130,50,75,90,73), 40);
  delay(100);
  BraccioRobot.moveToPosition(pos.set(154,100,150,160,90,73), 40);  
  delay(400);
  BraccioRobot.moveToPosition(pos.set(154,85,110,175,90,73), 40);  
  delay(100);
  BraccioRobot.moveToPosition(pos.set(154,85,80,97,90,73), 40);
  delay(100);
  BraccioRobot.moveToPosition(pos.set(154,85,180,0,90,73), 40);
  delay(500);
  BraccioRobot.moveToPosition(pos.set(154,85,180,97,90,73), 40);
  delay(200);
  BraccioRobot.moveToPosition(pos.set(154,85,80,180,90,73), 40);
  BraccioRobot.moveToPosition(pos.set(154,85,80,97,90,73), 40);
}

void program3(){
  Serial.println("Program: Braccio rotation");
  BraccioRobot.moveToPosition(pos.set( 154, 85 , 80, 97,  90,  73), 25);  
  delay(300);
  BraccioRobot.moveToPosition(pos.set(50, 85, 80,97,90,10), 25);
  delay(500);
  BraccioRobot.moveToPosition(pos.set(50, 85, 180,97,90,73), 25); 
  delay(300);
  BraccioRobot.moveToPosition(pos.set(180,85,180,10,90,73), 25);  
  delay(10);
  BraccioRobot.moveToPosition(pos.set(154,150,10,10,90,73), 25);  
  delay(600);
  BraccioRobot.moveToPosition(pos.set(50,150,10,10,90,73), 25);  
  delay(2000);
  BraccioRobot.moveToPosition(pos.set(50,85,80,97,90,73),25 );  
  delay(500);
  BraccioRobot.moveToPosition(pos.set(154,85,50,97,90,73), 25);
  delay(500);
  BraccioRobot.moveToPosition(pos.set(154,85,180,0,90,73), 25);
  BraccioRobot.moveToPosition(pos.set(50, 85, 180,0,90,73), 25);
  BraccioRobot.moveToPosition(pos.set(180,85,180,0,90,73), 25);
  BraccioRobot.moveToPosition(pos.set(50, 85, 180,0,90,73), 25);
  BraccioRobot.moveToPosition(pos.set(154,85,80,97,90,73), 25);
  delay(250);
}
