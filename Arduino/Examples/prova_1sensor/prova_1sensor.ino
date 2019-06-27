    // (c) Michael Schoeffler 2017, http://www.mschoeffler.de
    #include "Wire.h" // This library allows you to communicate with I2C devices.
    const int MPU_ADDR = 0x68; // I2C address of the MPU-6050. If AD0 pin is set to HIGH, the I2C address will be 0x69.
    int16_t accelerometer_x, accelerometer_y, accelerometer_z; // variables for accelerometer raw data
    int16_t gyro_x, gyro_y, gyro_z; // variables for gyro raw data
    int16_t temperature; // variables for temperature data
    char tmp_str[7]; // temporary variable used in convert function
    char* convert_int16_to_str(int16_t i) { // converts int16 to string. Moreover, resulting strings will have the same length in the debug monitor.
      sprintf(tmp_str, "%6d", i);
      return tmp_str;
    }
    void setup() {
      //Set AD0 Pins, A0 for Gyroscope 1, A1 for Gyroscope 2
      pinMode(A0, OUTPUT);
      digitalWrite(A0,LOW);
      pinMode(A1, OUTPUT);
      digitalWrite(A1,HIGH);    
      
      Serial.begin(9600);
      Wire.begin();
      Wire.beginTransmission(MPU_ADDR); // Begins a transmission to the I2C slave (GY-521 board)
      Wire.write(0x6B); // PWR_MGMT_1 register
      Wire.write(0); // set to zero (wakes up the MPU-6050)
      Wire.endTransmission(true);

      digitalWrite(A0,HIGH);
      digitalWrite(A1,LOW);
      Serial.begin(9600);
      Wire.begin();
      Wire.beginTransmission(MPU_ADDR); // Begins a transmission to the I2C slave (GY-521 board)
      Wire.write(0x6B); // PWR_MGMT_1 register
      Wire.write(0); // set to zero (wakes up the MPU-6050)
      Wire.endTransmission(true);
    }
    void loop() {
      //Enable read for gyroscope 1 
      digitalWrite(A0,LOW);
      //Disable read for gyroscope 2
      digitalWrite(A1,HIGH);
      Wire.beginTransmission(MPU_ADDR);
      Wire.write(0x43); // starting with register 0x3B (ACCEL_XOUT_H) [MPU-6000 and MPU-6050 Register Map and Descriptions Revision 4.2, p.40]
      Wire.endTransmission(false); // the parameter indicates that the Arduino will send a restart. As a result, the connection is kept active.
      Wire.requestFrom(MPU_ADDR, 3*2, true); // request a total of 7*2=14 registers
      
      gyro_x = Wire.read()<<8 | Wire.read(); // reading registers: 0x43 (GYRO_XOUT_H) and 0x44 (GYRO_XOUT_L)
      gyro_y = Wire.read()<<8 | Wire.read(); // reading registers: 0x45 (GYRO_YOUT_H) and 0x46 (GYRO_YOUT_L)
      gyro_z = Wire.read()<<8 | Wire.read(); // reading registers: 0x47 (GYRO_ZOUT_H) and 0x48 (GYRO_ZOUT_L)
      
      gyro_x = map(gyro_x, -17000, 17000, 0, 180);  //maps x axis rotation values from 0 to 180
      gyro_y = map(gyro_y, -17000, 17000, 0, 180);  //maps x axis rotation values from 0 to 180
      gyro_z = map(gyro_z, -17000, 17000, 0, 180);  //maps x axis rotation values from 0 to 180

      // print out data
      Serial.print("Giroscopi 1 ");
      Serial.print(" | gX = "); Serial.print(convert_int16_to_str(gyro_x));
      Serial.print(" | gY = "); Serial.print(convert_int16_to_str(gyro_y));
      Serial.print(" | gZ = "); Serial.print(convert_int16_to_str(gyro_z));
      Serial.println();
      
      // delay
      delay(500);

      //Read gyroscope 2 
      digitalWrite(A0,HIGH);
      digitalWrite(A1,LOW);
      Wire.beginTransmission(MPU_ADDR);
      Wire.write(0x43); // starting with register 0x3B (ACCEL_XOUT_H) [MPU-6000 and MPU-6050 Register Map and Descriptions Revision 4.2, p.40]
      Wire.endTransmission(false); // the parameter indicates that the Arduino will send a restart. As a result, the connection is kept active.
      Wire.requestFrom(MPU_ADDR, 3*2, true); // request a total of 7*2=14 registers
      
      gyro_x = Wire.read()<<8 | Wire.read(); // reading registers: 0x43 (GYRO_XOUT_H) and 0x44 (GYRO_XOUT_L)
      gyro_y = Wire.read()<<8 | Wire.read(); // reading registers: 0x45 (GYRO_YOUT_H) and 0x46 (GYRO_YOUT_L)
      gyro_z = Wire.read()<<8 | Wire.read(); // reading registers: 0x47 (GYRO_ZOUT_H) and 0x48 (GYRO_ZOUT_L)

      gyro_x = map(gyro_x, -17000, 17000, 0, 180);  //maps x axis rotation values from 0 to 180
      gyro_y = map(gyro_y, -17000, 17000, 0, 180);  //maps x axis rotation values from 0 to 180
      gyro_z = map(gyro_z, -17000, 17000, 0, 180);  //maps x axis rotation values from 0 to 180
      
      // print out data
      Serial.print("Giroscopi 2 ");
      Serial.print(" | gX = "); Serial.print(convert_int16_to_str(gyro_x));
      Serial.print(" | gY = "); Serial.print(convert_int16_to_str(gyro_y));
      Serial.print(" | gZ = "); Serial.print(convert_int16_to_str(gyro_z));
      Serial.println();
      
      // delay
      delay(500);
    }
