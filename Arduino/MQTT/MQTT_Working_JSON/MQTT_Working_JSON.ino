#include <YunClient.h>
#include <PubSubClient.h>
#include <ArduinoJson.h> 

//char* deviceId     = "SUMMERINTERNS"; // * set your device id (will be the MQTT client username) DO NOT NEED?
//char* deviceSecret = "Passord"; // * set your device secret (will be the MQTT client password) DO NOT NEED?
char* outTopic     = "Data"; // * MQTT channel where physical updates are published
char* inTopic      = "inTopic"; // * MQTT channel where lelylan updates are received
//char* clientId     = "Arduino1"; // * set a random string (max 23 chars, will be the MQTT client id) DO NOT NEED?

byte server[] = { 195, 159, 164, 54 }; // MQTT server address
char* payload  = "{""Sensor_1: 128 ""}"; // Used for testing 
char buffer[256];

bool isRunning = true; // true if the robotic arm is running (need to set function for this)
bool data = true; // true if there is any data recieved from the sensors, will not publish if there is no data. (Need to set function for this)

long time = 0;

size_t n;

char* test;

long randNumber;    
// Yun configuration
byte mac[] = {0xA8, 0x40, 0x41, 0x1A, 0x4C, 0x0C }; // MAC adress of the Arduino Yun
BridgeClient yun;
PubSubClient client;     


void setup() {
  Serial.begin(9600);
  delay(500);
  Serial.println("Starting initialization of Yun...");
  Bridge.begin();
  Serial.println("Bridge finished setup");
  client.setClient(yun);
  client.setServer(server, 1883);  
  brokerConnection();
}

void loop() {
  char* value;
  randNumber = random(22, 180);    
  jsonSerializer(randNumber,45,67,890.12, 0); // Currently used for testinng instead of real sensor data
  if (isRunning) {
    if (data) {
      Serial.println("Publishing message");
      brokerPublish("publish");
      
    } else {
      Serial.println("No data, no publishing");
    }
    delay(150);
    time = millis();
  }
}

// Serializes the given angles and weight to a JSON string 
void jsonSerializer (int lower, int middle, int upper, float weight, int rotation){
  const size_t capacity = JSON_OBJECT_SIZE(5);
  DynamicJsonDocument doc(capacity);
  
  doc["lower"] = lower;
  doc["middle"] = middle;
  doc["upper"] = upper;
  doc["weight"] = weight;
  doc["rotation"] = rotation; 

  size_t n = serializeJson(doc, buffer); //Sends the serialized JSON string to the buffer, also calculates the byte size to optimize number of cpu cycles
  serializeJson(doc, Serial);
}

//MQTT server connection
void brokerConnection() {
  Serial.println("Starting connection");
  if (!client.connected()) {
    if (client.connect(inTopic)) {
      Serial.println("Arduino successfully connected with MQTT broker");
      //brokerSubscribe(); // subscribe to topic currently not used
    }
  }
  client.loop();
}

// MQTT publish 
void brokerPublish(char* value) {
  if (value == "publish")
    //client.publish(outTopic, payload); //used for testing
    client.publish(outTopic, buffer, n);
  else
    Serial.println("Error when publishing");
}

// MQTT subscribe (Currently not used, but could be used in the future to control the robotic arm)
void brokerSubscribe() {
  client.subscribe(inTopic);
}
