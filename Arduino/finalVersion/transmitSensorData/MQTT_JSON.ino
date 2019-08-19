#include <BridgeClient.h>
#include <PubSubClient.h>
#include <ArduinoJson.h> 

//char* deviceId     = "SUMMERINTERNS"; // * set your device id (will be the MQTT client username) DO NOT NEED?
//char* deviceSecret = "Passord"; // * set your device secret (will be the MQTT client password) DO NOT NEED?
char const *outTopic     = "Data"; // * MQTT channel where physical updates are published
char const *inTopic      = "inTopic"; // * MQTT channel where lelylan updates are received
//char* clientId     = "Arduino1"; // * set a random string (max 23 chars, will be the MQTT client id) DO NOT NEED?

byte server[] = { 195, 159, 164, 54 }; // MQTT server address
//char* payload  = "{""Sensor_1: 128 ""}"; // Used for testing 
char buffer[256];

bool isRunning = true; // true if the robotic arm is running (need to set function for this)
bool data = true; // true if there is any data recieved from the sensors, will not publish if there is no data. (Need to set function for this)

//long time = 0;

size_t n;

//char* test;

//long randNumber;    
// Yun configuration
byte mac[] = {0xA8, 0x40, 0x41, 0x1A, 0x4C, 0x0C }; // MAC adress of the Arduino Yun
BridgeClient yun;
PubSubClient client;     


void MQTTSetup() {
  //Serial.begin(9600);
 // delay(500);
 
  Bridge.begin();
  client.setClient(yun);
  client.setServer(server, 1883);  
  brokerConnection();
}

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

// MQTT subscribe (Currently not used, but could be used in the future to control the robotic arm)
void brokerSubscribe() {
  client.subscribe(inTopic);
}
*/
