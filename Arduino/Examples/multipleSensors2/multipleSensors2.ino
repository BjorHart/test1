#include <Wire.h>  //imports Wire library
#include <MPU6050.h>
#include <Servo.h>



void setup() {  //  setup method
  Serial.begin(9600);
  Wire.begin();  //starts I2C communication

  for (int i = 2; i <= 3; i++) {
    pinMode(i, OUTPUT);  // defines pins as output pins
    analogWrite( i, 50);   // park the sensor at 0x69
  }

  /*
  for (int i = 2; i <= 3; i++) {
    digitalWrite( i, LOW);    // set this sensor at 0x68
    gyro.initialize();  //initializes MPU6050 sensor at 0x68
    digitalWrite( i, HIGH);   // park this sensor at 0x69
  }
  */
}

void loop() {  //main method
  for (int i = 2; i <= 3; i++) {
    analogWrite( i, 0);    // set this sensor at 0x68
    delay(10000);
    analogWrite( i, 50);   // park this sensor at 0x69

    }
}
/*
void loop() {  //main method
  for (int i = 22; i <= 35; i++) {
    digitalWrite( i, LOW);    // set this sensor at 0x68
    gyro.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);  //calls values from sensor at 0x68
    digitalWrite( i, HIGH);   // park this sensor at 0x69

    ax = map(ax, -17000, 17000, 0, 180);  //maps x axis rotation values from 0 to 180
    ...

 */
