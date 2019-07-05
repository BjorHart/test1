// MPU


#include "Wire.h"
#include "I2Cdev.h"
#include "MPU6050_6Axis_MotionApps20.h"
const int MPU2=0x69,MPU1=0x68;
//MPU6050 mpu;
MPU6050 mpu(0x68);
MPU6050 mpu2(0x69);

// Use the following global variables and access functions to help store the overall
// rotation angle of the sensor
unsigned long last_read_time1;
float         last_x_angle1;  // These are the filtered angles
float         last_y_angle1;
float         last_z_angle1;  
float         last_gyro_x_angle1;  // Store the gyro angles to compare drift
float         last_gyro_y_angle1;
float         last_gyro_z_angle1;

unsigned long last_read_time2;
float         last_x_angle2;  // These are the filtered angles
float         last_y_angle2;
float         last_z_angle2;  
float         last_gyro_x_angle2;  // Store the gyro angles to compare drift
float         last_gyro_y_angle2;
float         last_gyro_z_angle2;

void set_last_read_angle_data1(unsigned long time, float x, float y, float z, float x_gyro, float y_gyro, float z_gyro) {
  last_read_time1 = time;
  last_x_angle1 = x;
  last_y_angle1 = y;
  last_z_angle1 = z;
  last_gyro_x_angle1 = x_gyro;
  last_gyro_y_angle1 = y_gyro;
  last_gyro_z_angle1 = z_gyro;
}

void set_last_read_angle_data2(unsigned long time, float x, float y, float z, float x_gyro, float y_gyro, float z_gyro) {
  last_read_time2 = time;
  last_x_angle2 = x;
  last_y_angle2 = y;
  last_z_angle2 = z;
  last_gyro_x_angle2 = x_gyro;
  last_gyro_y_angle2 = y_gyro;
  last_gyro_z_angle2 = z_gyro;
}

// Variables to store the values from the sensor readings
int16_t ax, ay, az;
int16_t gx, gy, gz;

inline unsigned long get_last_time(int sensor) {
  if (sensor) { 
  return last_read_time2;
   }
  return last_read_time1;
  }
inline float get_last_x_angle(int sensor) {
  if (sensor) { 
  return last_x_angle2;
   }
  return last_x_angle1;
  }

inline float get_last_y_angle(int sensor) {
  if (sensor) { 
  return last_y_angle2;
   }
  return last_y_angle1;
  }

inline float get_last_z_angle(int sensor) {
 if (sensor) { 
  return last_z_angle2;
   }
  return last_z_angle1;
  }

inline float get_last_gyro_x_angle(int sensor){
 if (sensor) { 
  return last_gyro_x_angle2;
   }
  return last_gyro_x_angle1;
  } 

inline float get_last_gyro_y_angle(int sensor) {
  if (sensor) { 
    return last_gyro_y_angle2;
    }
    return last_gyro_y_angle1;
    } 
inline float get_last_gyro_z_angle(int sensor){
  if (sensor) { 
    return last_gyro_y_angle2;
    }
    return last_gyro_y_angle1;
    } 

//  Use the following global variables 
//  to calibrate the gyroscope sensor and accelerometer readings
float    base_x_gyro1 = 0;
float    base_y_gyro1 = 0;
float    base_z_gyro1 = 0;
float    base_x_accel1 = 0;
float    base_y_accel1 = 0;
float    base_z_accel1 = 0;

float    base_x_gyro2 = 0;
float    base_y_gyro2 = 0;
float    base_z_gyro2 = 0;
float    base_x_accel2 = 0;
float    base_y_accel2 = 0;
float    base_z_accel2 = 0;


// This global variable tells us how to scale gyroscope data
float    GYRO_FACTOR;

// This global varible tells how to scale acclerometer data
float    ACCEL_FACTOR;


// ================================================================
// ===                CALIBRATION_ROUTINE                       ===
// ================================================================
// Simple calibration - just average first few readings to subtract
// from the later data
void calibrate_sensor1() {
  int       num_readings = 100;

  // Discard the first reading (don't know if this is needed or
  // not, however, it won't hurt.)
      //--------------------------------------- Collect data ---------------

      Wire.beginTransmission(MPU1); 
      Wire.write(0x3B); // starting with register 0x3B (ACCEL_XOUT_H) 
      Wire.endTransmission(false);
      Wire.requestFrom(MPU1, 14, true); // request a total of 14 registers 
      ax=Wire.read()<<8| Wire.read(); // 0x3B (ACCEL_XOUT_H) & 0x3C (ACCEL_XOUT_L) 
      ay=Wire.read()<<8|  Wire.read(); // 0x3D (ACCEL_YOUT_H) & 0x3E (ACCEL_YOUT_L)
      az=Wire.read()<<8| Wire.read(); // 0x3F (ACCEL_ZOUT_H) & 0x40 (ACCEL_ZOUT_L) 
      gx=Wire.read()<<8| Wire.read(); // 0x43 (GYRO_XOUT_H) & 0x44 (GYRO_XOUT_L) 
      gy=Wire.read()<<8| Wire.read(); // 0x45 (GYRO_YOUT_H) & 0x46 (GYRO_YOUT_L) 
      gz=Wire.read()<<8| Wire.read(); // 0x47 (GYRO_ZOUT_H) & 0x48 (GYRO_ZOUT_L) 

        //----------------------------------------- End collecting data -------------

  // Read and average the raw values
  for (int i = 0; i < num_readings; i++) {
      //--------------------------------------- Collect data ---------------

      Wire.beginTransmission(MPU1); 
      Wire.write(0x3B); // starting with register 0x3B (ACCEL_XOUT_H) 
      Wire.endTransmission(false);
      Wire.requestFrom(MPU1, 14, true); // request a total of 14 registers 
      ax=Wire.read()<<8| Wire.read(); // 0x3B (ACCEL_XOUT_H) & 0x3C (ACCEL_XOUT_L) 
      ay=Wire.read()<<8|  Wire.read(); // 0x3D (ACCEL_YOUT_H) & 0x3E (ACCEL_YOUT_L)
      az=Wire.read()<<8| Wire.read(); // 0x3F (ACCEL_ZOUT_H) & 0x40 (ACCEL_ZOUT_L) 
      gx=Wire.read()<<8| Wire.read(); // 0x43 (GYRO_XOUT_H) & 0x44 (GYRO_XOUT_L) 
      gy=Wire.read()<<8| Wire.read(); // 0x45 (GYRO_YOUT_H) & 0x46 (GYRO_YOUT_L) 
      gz=Wire.read()<<8| Wire.read(); // 0x47 (GYRO_ZOUT_H) & 0x48 (GYRO_ZOUT_L) 

        //----------------------------------------- End collecting data -------------
    base_x_gyro1 += gx;
    base_y_gyro1 += gy;
    base_z_gyro1 += gz;
    base_x_accel1 += ax;
    base_y_accel1 += ay;
    base_y_accel1 += az;
  }
  
  base_x_gyro1 /= num_readings;
  base_y_gyro1 /= num_readings;
  base_z_gyro1 /= num_readings;
  base_x_accel1 /= num_readings;
  base_y_accel1 /= num_readings;
  base_z_accel1 /= num_readings;
}

void calibrate_sensor2() {
  int       num_readings = 100;

  // Discard the first reading (don't know if this is needed or
  // not, however, it won't hurt.)
      //--------------------------------------- Collect data ---------------

      Wire.beginTransmission(MPU2); 
      Wire.write(0x3B); // starting with register 0x3B (ACCEL_XOUT_H) 
      Wire.endTransmission(false);
      Wire.requestFrom(MPU2, 14, true); // request a total of 14 registers 
      ax=Wire.read()<<8| Wire.read(); // 0x3B (ACCEL_XOUT_H) & 0x3C (ACCEL_XOUT_L) 
      ay=Wire.read()<<8|  Wire.read(); // 0x3D (ACCEL_YOUT_H) & 0x3E (ACCEL_YOUT_L)
      az=Wire.read()<<8| Wire.read(); // 0x3F (ACCEL_ZOUT_H) & 0x40 (ACCEL_ZOUT_L) 
      gx=Wire.read()<<8| Wire.read(); // 0x43 (GYRO_XOUT_H) & 0x44 (GYRO_XOUT_L) 
      gy=Wire.read()<<8| Wire.read(); // 0x45 (GYRO_YOUT_H) & 0x46 (GYRO_YOUT_L) 
      gz=Wire.read()<<8| Wire.read(); // 0x47 (GYRO_ZOUT_H) & 0x48 (GYRO_ZOUT_L) 

        //----------------------------------------- End collecting data -------------
  
  // Read and average the raw values
  for (int i = 0; i < num_readings; i++) {
      //--------------------------------------- Collect data ---------------

      Wire.beginTransmission(MPU2); 
      Wire.write(0x3B); // starting with register 0x3B (ACCEL_XOUT_H) 
      Wire.endTransmission(false);
      Wire.requestFrom(MPU2, 14, true); // request a total of 14 registers 
      ax=Wire.read()<<8| Wire.read(); // 0x3B (ACCEL_XOUT_H) & 0x3C (ACCEL_XOUT_L) 
      ay=Wire.read()<<8|  Wire.read(); // 0x3D (ACCEL_YOUT_H) & 0x3E (ACCEL_YOUT_L)
      az=Wire.read()<<8| Wire.read(); // 0x3F (ACCEL_ZOUT_H) & 0x40 (ACCEL_ZOUT_L) 
      gx=Wire.read()<<8| Wire.read(); // 0x43 (GYRO_XOUT_H) & 0x44 (GYRO_XOUT_L) 
      gy=Wire.read()<<8| Wire.read(); // 0x45 (GYRO_YOUT_H) & 0x46 (GYRO_YOUT_L) 
      gz=Wire.read()<<8| Wire.read(); // 0x47 (GYRO_ZOUT_H) & 0x48 (GYRO_ZOUT_L) 

        //----------------------------------------- End collecting data -------------
    base_x_gyro2 += gx;
    base_y_gyro2 += gy;
    base_z_gyro2 += gz;
    base_x_accel2 += ax;
    base_y_accel2 += ay;
    base_y_accel2 += az;
  }
  
  base_x_gyro2 /= num_readings;
  base_y_gyro2 /= num_readings;
  base_z_gyro2 /= num_readings;
  base_x_accel2 /= num_readings;
  base_y_accel2 /= num_readings;
  base_z_accel2 /= num_readings;
}

byte error = 1; 
int i = 0;

void setup() {


      Wire.begin(); 
      Wire.beginTransmission(MPU1);
      Wire.write(0x6B);// PWR_MGMT_1 register 
      Wire.write(0); // set to zero (wakes up the MPU-6050)
      Wire.endTransmission(true);
      Wire.begin(); 
      Wire.beginTransmission(MPU2);
      Wire.write(0x6B);// PWR_MGMT_1 register 
      Wire.write(0); // set to zero (wakes up the MPU-6050)
      Wire.endTransmission(true);
      Serial.begin(115200);

     // initialize device
    Serial.println(F("Initializing I2C devices..."));
    mpu.initialize();
    // verify connection
    Serial.println(F("Testing device connections..."));
    Serial.println(mpu.testConnection() ? F("MPU6050 connection successful") : F("MPU6050 connection failed"));


    while (i < 2) {
      int nDevices;
      Serial.println("Scanning...");
      nDevices = 0;
      for(byte address = 1; address < 127; address++) {
        
        Wire.beginTransmission(address);
        error = Wire.endTransmission();
          if (!error) {
            i++;
            Serial.print("I2C device found at address 0x");
            Serial.print(address,HEX);
            Serial.println("  !");
            }
          }
      }
      delay(1000);
    
    // get calibration values for sensors
    for (int i = 0; i < 2; i++) {
      if (i == 0) {
        calibrate_sensor1();
        set_last_read_angle_data1(millis(), 0, 0, 0, 0, 0, 0);
        Serial.println("Sensor 1 calibrated");
      }
      else {
        calibrate_sensor2();
        set_last_read_angle_data2(millis(), 0, 0, 0, 0, 0, 0);
        Serial.println("Sensor 2 calibrated");
      }
    }

    // Set the full scale range of the gyro
        uint8_t FS_SEL = 0;
       
        uint8_t READ_FS_SEL = mpu.getFullScaleGyroRange();
        Serial.print("FS_SEL = ");
        Serial.println(READ_FS_SEL);
        GYRO_FACTOR = 131.0/(FS_SEL + 1);
    
        // get default full scale value of accelerometer - may not be default value.  
        // Accelerometer scale factor doesn't reall matter as it divides out
        uint8_t READ_AFS_SEL = mpu.getFullScaleAccelRange();
        Serial.print("AFS_SEL = ");
        Serial.println(READ_AFS_SEL);
}

void loop() {
       
       GetMpuValue1(MPU1);

       GetMpuValue2(MPU2);
   
}

void GetMpuValue1(const int MPU) {

         const float RADIANS_TO_DEGREES = 57.2958; //180/3.14159

        unsigned long t_now = millis();
        //--------------------------------------- Collect data ---------------
          
                Wire.beginTransmission(MPU); 
                Wire.write(0x3B);
                Wire.endTransmission();
                Wire.requestFrom(MPU,6);
                while(Wire.available() < 6);
                ax = Wire.read()<<8|Wire.read(); 
                ay = Wire.read()<<8|Wire.read(); 
                az = Wire.read()<<8|Wire.read();
                
                Wire.beginTransmission(MPU);
                Wire.write(0x43);
                Wire.endTransmission();
                Wire.requestFrom(MPU,6);
                while(Wire.available() < 6);
                gx = Wire.read()<<8|Wire.read();
                gy = Wire.read()<<8|Wire.read();
                gz = Wire.read()<<8|Wire.read(); 
        //----------------------------------------- End collecting data -------------


        // Keep calculating the values of the complementary filter angles for comparison with DMP here
        // Read the raw accel/gyro values from the MPU-6050
      //  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
        Serial.println("Inside mpu1 - 1");
        Serial.println("Inside mpu1 - 2");
        // Remove offsets and scale gyro data  
        Serial.println(gx);
        Serial.println(base_x_gyro1);
        Serial.println(GYRO_FACTOR);
        float gyro_x = (gx - base_x_gyro1)/GYRO_FACTOR;

        float gyro_y = (gy - base_y_gyro1)/GYRO_FACTOR;

        float gyro_z = (gz - base_z_gyro1)/GYRO_FACTOR;

        float accel_x = ax; // - base_x_accel;

        float accel_y = ay; // - base_y_accel;

        float accel_z = az; // - base_z_accel;
        float accel_angle_y = atan(-1*accel_x/sqrt(pow(accel_y,2) + pow(accel_z,2)))*RADIANS_TO_DEGREES;
        float accel_angle_x = atan(accel_y/sqrt(pow(accel_x,2) + pow(accel_z,2)))*RADIANS_TO_DEGREES;
        float accel_angle_z = 0;
        // Compute the (filtered) gyro angles
        float dt =(t_now - get_last_time(1))/1000.0;
        float gyro_angle_x = gyro_x*dt + get_last_x_angle(0);
        float gyro_angle_y = gyro_y*dt + get_last_y_angle(0);
        float gyro_angle_z = gyro_z*dt + get_last_z_angle(0);
        
        // Compute the drifting gyro angles
        float unfiltered_gyro_angle_x = gyro_x*dt + get_last_gyro_x_angle(0);
        float unfiltered_gyro_angle_y = gyro_y*dt + get_last_gyro_y_angle(0);
        float unfiltered_gyro_angle_z = gyro_z*dt + get_last_gyro_z_angle(0);     
        
        // Apply the complementary filter to figure out the change in angle - choice of alpha is
        // estimated now.  Alpha depends on the sampling rate...
        const float alpha = 0.96;
        float angle_x = alpha*gyro_angle_x + (1.0 - alpha)*accel_angle_x;
        float angle_y = alpha*gyro_angle_y + (1.0 - alpha)*accel_angle_y;
        float angle_z = gyro_angle_z;  //Accelerometer doesn't give z-angle
        // Update the saved data with the latest values
        set_last_read_angle_data1(t_now, angle_x, angle_y, angle_z, unfiltered_gyro_angle_x, unfiltered_gyro_angle_y, unfiltered_gyro_angle_z);
        
        Serial.print("CMP1:");
        Serial.print(get_last_x_angle(0), 2);
        Serial.print(":");
        Serial.print(get_last_y_angle(0), 2);
        Serial.print(":");
        Serial.println(-get_last_z_angle(0), 2);
}


void GetMpuValue2(const int MPU) {

         const float RADIANS_TO_DEGREES = 57.2958; //180/3.14159

        unsigned long t_now = millis();

         //--------------------------------------- Collect data ---------------

                Wire.beginTransmission(MPU); 

                Wire.write(0x3B);

                Wire.endTransmission();

                Wire.requestFrom(MPU,6);

             //while(Wire.available() < 6)    Serial.println("Inside mpu2 - 0.9");      

                ax = Wire.read()<<8|Wire.read(); 
                ay = Wire.read()<<8|Wire.read(); 
                az = Wire.read()<<8|Wire.read();
                Wire.beginTransmission(MPU);

                Wire.write(0x43);
                Wire.endTransmission();
                Wire.requestFrom(MPU,6);
             // while(Wire.available() < 6)              Serial.println("Inside mpu2 - 1.9");   

                gx = Wire.read()<<8|Wire.read();
                gy = Wire.read()<<8|Wire.read();
                gz = Wire.read()<<8|Wire.read(); 

        //----------------------------------------- End collecting data -------------

        // Keep calculating the values of the complementary filter angles for comparison with DMP here
        // Read the raw accel/gyro values from the MPU-6050
       // mpu2.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
        // Remove offsets and scale gyro data  
        float gyro_x = (gx - base_x_gyro2)/GYRO_FACTOR;
        float gyro_y = (gy - base_y_gyro2)/GYRO_FACTOR;
        float gyro_z = (gz - base_z_gyro2)/GYRO_FACTOR;
        float accel_x = ax; // - base_x_accel;
        float accel_y = ay; // - base_y_accel;
        float accel_z = az; // - base_z_accel;
        float accel_angle_y = atan(-1*accel_x/sqrt(pow(accel_y,2) + pow(accel_z,2)))*RADIANS_TO_DEGREES;
        float accel_angle_x = atan(accel_y/sqrt(pow(accel_x,2) + pow(accel_z,2)))*RADIANS_TO_DEGREES;
        float accel_angle_z = 0;
        // Compute the (filtered) gyro angles
        float dt =(t_now - get_last_time(2))/1000.0;
        float gyro_angle_x = gyro_x*dt + get_last_x_angle(2);
        float gyro_angle_y = gyro_y*dt + get_last_y_angle(2);
        float gyro_angle_z = gyro_z*dt + get_last_z_angle(2);
        
        // Compute the drifting gyro angles
        float unfiltered_gyro_angle_x = gyro_x*dt + get_last_gyro_x_angle(2);
        float unfiltered_gyro_angle_y = gyro_y*dt + get_last_gyro_y_angle(2);
        float unfiltered_gyro_angle_z = gyro_z*dt + get_last_gyro_z_angle(2);     
        // Apply the complementary filter to figure out the change in angle - choice of alpha is
        // estimated now.  Alpha depends on the sampling rate...
        const float alpha = 0.96;
        float angle_x = alpha*gyro_angle_x + (1.0 - alpha)*accel_angle_x;
        float angle_y = alpha*gyro_angle_y + (1.0 - alpha)*accel_angle_y;
        float angle_z = gyro_angle_z;  //Accelerometer doesn't give z-angle
        // Update the saved data with the latest values
        set_last_read_angle_data2(t_now, angle_x, angle_y, angle_z, unfiltered_gyro_angle_x, unfiltered_gyro_angle_y, unfiltered_gyro_angle_z);
        
        Serial.print("CMP2:");
        Serial.print(get_last_x_angle(2), 2);
        Serial.print(":");
        Serial.print(get_last_y_angle(2), 2);
        Serial.print(":");
        Serial.println(-get_last_z_angle(2), 2);
}
