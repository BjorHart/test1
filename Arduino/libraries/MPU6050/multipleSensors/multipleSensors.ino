#include <Wire.h>  //imports Wire library
#include <MPU6050.h>
#include <Servo.h>

MPU6050 gyroOne;  //creates new MPU6050 object
MPU6050 gyroTwo;  //creates new MPU6050 object
MPU6050 gyroThree;  //creates new MPU6050 object
int16_t ax, ay, az;  //creates angle variables
int16_t gx, gy, gz;
MPU6050 myGyros[] = {gyroOne, gyroTwo, gyroThree};

/*
myGyros[0] = gyroOne; //add gyro to list of gyros
myGyros[1] = gyroTwo; //add gyro to list of gyros
myGyros[2] = gyroThree; //add gyro to list of gyros
*/

void setup() {  //  setup method
  Serial.begin(9600);
  Wire.begin();  //starts I2C communication

  for (int i = 0; i <= 1; i++) {
    pinMode("A" + i, OUTPUT);  // defines pins as output pins
    digitalWrite( "A" + i, HIGH);   // park the sensor at 0x69
  }

  for (int i = 0; i <= 1; i++) {
    digitalWrite( "A" + i, LOW);    // set this sensor at 0x68
    myGyros[i].initialize();  //initializes MPU6050 sensor at 0x68
    digitalWrite( "A" + i, HIGH);   // park this sensor at 0x69
  }

}


void loop() {  //main method
  for (int i = 0; i <= 1; i++) {
    Serial.print("Sensor: ");
    Serial.println(i);

    digitalWrite( "A" + i, LOW);    // set this sensor at 0x68
    delay(100);
    myGyros[i].getMotion6(&ax, &ay, &az, &gx, &gy, &gz);  //calls values from sensor at 0x68
    digitalWrite( "A" + i, HIGH);   // park this sensor at 0x69
    delay(100);


  }
}
