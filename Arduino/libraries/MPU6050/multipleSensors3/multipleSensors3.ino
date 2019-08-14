#include <Wire.h>  //imports Wire library
#include <MPU6050.h>
#include <Servo.h>


void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  Wire.begin();

  pinMode(A0, OUTPUT);
  digitalWrite(A0, HIGH);
}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(A0, LOW);
  delay(10000);
  digitalWrite(A0, HIGH);
}
