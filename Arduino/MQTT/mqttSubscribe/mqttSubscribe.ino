//Subscribe function for deciding program
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
*/
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
*/
 
//MQTT subscribe ()
void brokerSubscribe() {
  client.subscribe(inTopic);
}

#include <YunClient.h>
#include <PubSubClient.h>

#define MQTT_SERVER "x.x.x.x"

#define MQTT_CLIENTID "YUN-Sensor"

void callback(char* topic, byte* payload, unsigned int length) {
  // handle message arrived
}

YunClient yun;
PubSubClient mqtt(MQTT_SERVER, 1883, callback, yun);

void setup()
{
  Serial.begin(9600);
  Bridge.begin();
  if (mqtt.connect(MQTT_CLIENTID)) {
    mqtt.publish("outTopic","hello world");
    mqtt.subscribe("inTopic");
  }
}

void loop()
{
  mqtt.loop();
}
