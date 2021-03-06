
// I2Cdev and MPU6050 must be installed as libraries, or else the .cpp/.h files
// for both classes must be in the include path of your project
#include "I2Cdev.h"
#include "MPU6050_6Axis_MotionApps20.h"

// Arduino Wire library is required if I2Cdev I2CDEV_ARDUINO_WIRE implementation
// is used in I2Cdev.h
#if I2CDEV_IMPLEMENTATION == I2CDEV_ARDUINO_WIRE
    #include "Wire.h"
#endif

MPU6050 mpu;

/* =========================================================================
   NOTE: In addition to connection 3.3v, GND, SDA, and SCL, this sketch
   depends on the MPU-6050's INT pin being connected to the Arduino's
   external interrupt #4 pin(Digital pin 7). On the Arduino Uno and Mega 2560, this is
   digital I/O pin 2.
 * ========================================================================= */



// uncomment "OUTPUT_READABLE_YAWPITCHROLL" if you want to see the yaw/
// pitch/roll angles (in degrees) calculated from the quaternions coming
// from the FIFO. Note this also requires gravity vector calculations.
// Also note that yaw/pitch/roll angles suffer from gimbal lock (for
// more info, see: http://en.wikipedia.org/wiki/Gimbal_lock)
#define OUTPUT_READABLE_YAWPITCHROLL

// MPU control/status vars
bool dmpReady = false;  // set true if DMP init was successful
uint8_t mpuIntStatus;   // holds actual interrupt status byte from MPU
uint8_t devStatus;      // return status after each device operation (0 = success, !0 = error)
uint16_t packetSize;    // expected DMP packet size (default is 42 bytes)
uint16_t fifoCount;     // count of all bytes currently in FIFO
uint8_t fifoBuffer[64]; // FIFO storage buffer

// orientation/motion vars
Quaternion q;           // [w, x, y, z]         quaternion container
VectorFloat gravity;    // [x, y, z]            gravity vector
float ypr[3];           // [yaw, pitch, roll]   yaw/pitch/roll container and gravity vector

volatile bool mpuInterrupt = false;     // indicates whether MPU interrupt pin has gone high


void dmpDataReady() {
    mpuInterrupt = true;
} 

///////////////////////////////////   CONFIGURATION   /////////////////////////////

int16_t ax, ay, az, gx, gy, gz;
uint16_t num_readings = 100;

void calibration(){
  
int16_t mean_ax, mean_ay, mean_az, mean_gx, mean_gy, mean_gz = 0;
Serial.println("Calibrating....");
for (int i = 0; i < num_readings; i++) {

  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
  mean_ax += ax;
  mean_ay += ay;
  mean_az += az;
  mean_gx += gx;
  mean_gy += gy;
  mean_gz += gz;
  
}
 mean_az = mean_az/num_readings;
 mean_gx = mean_gx/num_readings;
 mean_gy = mean_gy/num_readings;
 mean_gz = mean_gz/num_readings;
 
 mpu.setXAccelOffset(mean_ax);
 mpu.setYAccelOffset(mean_ay);
 mpu.setZAccelOffset(mean_az);
 mpu.setXGyroOffset(mean_gx);
 mpu.setYGyroOffset(mean_gy);
 mpu.setZGyroOffset(mean_gz);

 Serial.println(mean_ax);
 Serial.println(mean_ay);
 Serial.println(mean_az);
 Serial.println(mean_gx);
 Serial.println(mean_gy);
 Serial.println(mean_gz);
 
 Serial.println("Finished calibrating");
}



void rotationSensorSetup() {
    // join I2C bus (I2Cdev library doesn't do this automatically)
    #if I2CDEV_IMPLEMENTATION == I2CDEV_ARDUINO_WIRE
        Wire.begin();
        TWBR = 24; // 400kHz I2C clock (200kHz if CPU is 8MHz)
    #elif I2CDEV_IMPLEMENTATION == I2CDEV_BUILTIN_FASTWIRE
        Fastwire::setup(400, true);
    #endif

    // initialize serial communication
    // (115200 chosen because it is required for Teapot Demo output, but it's
    // really up to you depending on your project)
    Serial.begin(9600);
    
    // while (!Serial); // wait for Leonardo enumeration, others continue immediately       

    mpu.initialize();
     
    mpu.testConnection() ? F("MPU6050 connection successful") : F("MPU6050 connection failed");

    devStatus = mpu.dmpInitialize();
    
   //calibration();
    
    mpu.setXGyroOffset(220);
    mpu.setYGyroOffset(76);
    mpu.setZGyroOffset(-85);
    mpu.setZAccelOffset(1788); // 1688 factory default for my test chip
    
    // make sure it worked (returns 0 if so)
    if (!devStatus) {
      
        mpu.setDMPEnabled(true);        
        attachInterrupt(4, dmpDataReady, RISING);
        mpuIntStatus = mpu.getIntStatus();
        dmpReady = true;

        // get expected DMP packet size for later comparison
        packetSize = mpu.dmpGetFIFOPacketSize();
    } 
}


int rotationSensorUpdate() {

    // if programming failed, don't try to do anything
    if (!dmpReady) return;

    // wait for MPU interrupt or extra packet(s) available
    while (!mpuInterrupt && fifoCount < packetSize) {
     
    }
   
    mpuInterrupt = false;
    mpuIntStatus = mpu.getIntStatus();
    fifoCount = mpu.getFIFOCount();

    
    if ((mpuIntStatus & 0x10) || fifoCount == 1024) {
 
        mpu.resetFIFO();
      
  
    } else if (mpuIntStatus & 0x02) {
       
        while (fifoCount < packetSize) fifoCount = mpu.getFIFOCount();

        mpu.getFIFOBytes(fifoBuffer, packetSize);
       
        fifoCount -= packetSize;
        
        mpu.dmpGetQuaternion(&q, fifoBuffer);
        mpu.dmpGetGravity(&gravity, &q);
        mpu.dmpGetYawPitchRoll(ypr, &q, &gravity);
        return int((ypr[0]* 180/M_PI)); 
              
    }
}
