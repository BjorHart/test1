// I2Cdev and MPU6050 must be installed as libraries, or else the .cpp/.h files
// for both classes must be in the include path of your project
#include "I2Cdev.h"
#include "EnableInterrupt.h"
#include "MPU6050_6Axis_MotionApps20.h"
//#include "MPU6050.h" // not necessary if using MotionApps include file

// Arduino Wire library is required if I2Cdev I2CDEV_ARDUINO_WIRE implementation
// is used in I2Cdev.h
#if I2CDEV_IMPLEMENTATION == I2CDEV_ARDUINO_WIRE
    #include "Wire.h"
#endif


// class default I2C address is 0x68
// specific I2C addresses may be passed as a parameter here
// AD0 low = 0x68 (default for SparkFun breakout and InvenSense evaluation board)
// AD0 high = 0x69
//const int MPU2=0x69,MPU1=0x68;

//MPU6050 mpu;
MPU6050 mpu2(0x68);
MPU6050 mpu(0x69); // <-- use for AD0 high

/* =========================================================================
   NOTE: In addition to connection 3.3v, GND, SDA, and SCL, this sketch
   depends on the MPU-6050's INT pin being connected to the Arduino's
   external interrupt #0 pin. On the Arduino Uno and Mega 2560, this is
   digital I/O pin 2.
 * ========================================================================= */

#define OUTPUT_READABLE_YAWPITCHROLL



// MPU control/status vars
bool dmpReady = false;  // set true if DMP init was successful
uint8_t mpuIntStatus;   // holds actual interrupt status byte from MPU
uint8_t devStatus;      // return status after each device operation (0 = success, !0 = error)
uint16_t packetSize;    // expected DMP packet size (default is 42 bytes)
uint16_t fifoCount;     // count of all bytes currently in FIFO
uint8_t fifoBuffer[64]; // FIFO storage buffer

bool dmpReady2 = false;  // set true if DMP init was successful
uint8_t mpuIntStatus2;   // holds actual interrupt status byte from MPU
uint8_t devStatus2;      // return status after each device operation (0 = success, !0 = error)
uint16_t packetSize2;    // expected DMP packet size (default is 42 bytes)
uint16_t fifoCount2;     // count of all bytes currently in FIFO
uint8_t fifoBuffer2[64]; // FIFO storage buffer

// orientation/motion vars
Quaternion q;           // [w, x, y, z]         quaternion container
VectorInt16 aa;         // [x, y, z]            accel sensor measurements
VectorInt16 aaReal;     // [x, y, z]            gravity-free accel sensor measurements
VectorInt16 aaWorld;    // [x, y, z]            world-frame accel sensor measurements
VectorFloat gravity;    // [x, y, z]            gravity vector
float euler[3];         // [psi, theta, phi]    Euler angle container
float ypr[3];           // [yaw, pitch, roll]   yaw/pitch/roll container and gravity vector

Quaternion q2;           // [w, x, y, z]         quaternion container
VectorInt16 aa2;         // [x, y, z]            accel sensor measurements
VectorInt16 aaReal2;     // [x, y, z]            gravity-free accel sensor measurements
VectorInt16 aaWorld2;    // [x, y, z]            world-frame accel sensor measurements
VectorFloat gravity2;    // [x, y, z]            gravity vector
float euler2[3];         // [psi, theta, phi]    Euler angle container
float ypr2[3];           // [yaw, pitch, roll]   yaw/pitch/roll container and gravity vector

// packet structure for InvenSense teapot demo
uint8_t teapotPacket[14] = { '$', 0x02, 0,0, 0,0, 0,0, 0,0, 0x00, 0x00, '\r', '\n' };



// ================================================================
// ===               INTERRUPT DETECTION ROUTINE                ===
// ================================================================

volatile bool mpuInterrupt = false;     // indicates whether MPU interrupt pin has gone high
volatile bool mpuInterrupt2 = false;     // indicates whether MPU interrupt pin has gone high

void dmpDataReady() {
    mpuInterrupt = true;
}

void dmpDataReady2() {
    mpuInterrupt2 = true;
}

// ================================================================
// ===                      INITIAL SETUP                       ===
// ================================================================

void setup() {

    // join I2C bus (I2Cdev library doesn't do this automatically)
    #if I2CDEV_IMPLEMENTATION == I2CDEV_ARDUINO_WIRE
        Wire.begin();
        TWBR = 24; // 400kHz I2C clock (200kHz if CPU is 8MHz)
    #elif I2CDEV_IMPLEMENTATION == I2CDEV_BUILTIN_FASTWIRE
        Fastwire::setup(400, true);
    #endif

    // initialize serial communication
    Serial.begin(115200);
    while (!Serial); // wait for Leonardo enumeration, others continue immediately

    // initialize device
    Serial.println(F("Initializing I2C devices..."));
    mpu.initialize();
    mpu2.initialize();

    // verify connection
    Serial.println(F("Testing device connections..."));
    Serial.println(mpu.testConnection() ? F("MPU6050 connection successful") : F("MPU6050 connection failed"));
    Serial.println(mpu2.testConnection() ? F("MPU6050-2 connection successful") : F("MPU6050-2 connection failed"));
    
    // load and configure the DMP
    Serial.println(F("Initializing DMP..."));
    devStatus = mpu.dmpInitialize();
    devStatus2 = mpu2.dmpInitialize();

    // supply your own gyro offsets here, scaled for min sensitivity
    mpu.setXGyroOffset(220);
    mpu.setYGyroOffset(76);
    mpu.setZGyroOffset(-85);
    mpu.setZAccelOffset(1788); // 1688 factory default for my test chip

    mpu2.setXGyroOffset(220);
    mpu2.setYGyroOffset(76);
    mpu2.setZGyroOffset(-85);
    mpu2.setZAccelOffset(1788); // 1688 factory default for my test chip

    // make sure it worked (returns 0 if so)
    if (devStatus == 0 && devStatus2 == 0) {
        // turn on the DMP, now that it's ready
        Serial.println(F("Enabling DMP..."));
        mpu.setDMPEnabled(true);
        mpu2.setDMPEnabled(true);

        // enable Arduino interrupt detection
        Serial.println(F("Enabling interrupt detection (Arduino external interrupt 0)..."));
        enableInterrupt(8, dmpDataReady, RISING);
        enableInterrupt(9, dmpDataReady2, RISING);
        
        mpuIntStatus = mpu.getIntStatus();
        mpuIntStatus2 = mpu2.getIntStatus();


        // set our DMP Ready flag so the main loop() function knows it's okay to use it
        Serial.println(F("DMP ready! Waiting for first interrupt..."));
        dmpReady = true;
        dmpReady2 = true;
        
        // get expected DMP packet size for later comparison
        packetSize = mpu.dmpGetFIFOPacketSize();
        packetSize2 = mpu2.dmpGetFIFOPacketSize();
    } else {
        // ERROR!
        // 1 = initial memory load failed
        // 2 = DMP configuration updates failed
        // (if it's going to break, usually the code will be 1)
        Serial.print(F("DMP Initialization failed (code "));
        Serial.print(devStatus);
        Serial.print(devStatus2);

        Serial.println(F(")"));
    }

}



// ================================================================
// ===                    MAIN PROGRAM LOOP                     ===
// ================================================================

void loop() {

    
    // if programming failed, don't try to do anything
    if (!dmpReady || !dmpReady) return;

    // wait for MPU interrupt or extra packet(s) available
    while ((!mpuInterrupt && !mpuInterrupt2)) {
        // other program behavior stuff here
        // .
        // .
        // .
        // if you are really paranoid you can frequently test in between other
        // stuff to see if mpuInterrupt is true, and if so, "break;" from the
        // while() loop to immediately process the MPU data
        // .
        // .
        // .
    }

    if (mpuInterrupt) {
    // reset interrupt flag and get INT_STATUS byte
    mpuInterrupt = false;
    mpuIntStatus = mpu.getIntStatus();

    // get current FIFO count
    fifoCount = mpu.getFIFOCount();

    // check for overflow (this should never happen unless our code is too inefficient)
    if ((mpuIntStatus & 0x10) || fifoCount == 1024) {
        // reset so we can continue cleanly
        mpu.resetFIFO();
        Serial.println(F("FIFO overflow!"));

    // otherwise, check for DMP data ready interrupt (this should happen frequently)
    } else if (mpuIntStatus & 0x02) {
        // wait for correct available data length, should be a VERY short wait
        while (fifoCount < packetSize) fifoCount = mpu.getFIFOCount();

        // read a packet from FIFO
        mpu.getFIFOBytes(fifoBuffer, packetSize);
        
        // track FIFO count here in case there is > 1 packet available
        // (this lets us immediately read more without waiting for an interrupt)
        fifoCount -= packetSize;

        #ifdef OUTPUT_READABLE_YAWPITCHROLL
            // display Euler angles in degrees
            mpu.dmpGetQuaternion(&q, fifoBuffer);
            mpu.dmpGetGravity(&gravity, &q);
            mpu.dmpGetYawPitchRoll(ypr, &q, &gravity);
            mpu.resetFIFO();
            Serial.print("CMP1:");
            Serial.print(ypr[0] * 180/M_PI);
            Serial.print(":");
            Serial.print(ypr[1] * 180/M_PI);
            Serial.print(":");
            Serial.println(ypr[2] * 180/M_PI);
        #endif


    }

    } else {
    
     
     // reset interrupt flag and get INT_STATUS byte
    mpuInterrupt2 = false;
    mpuIntStatus2 = mpu2.getIntStatus();

    // get current FIFO count
    fifoCount = mpu2.getFIFOCount();

    // check for overflow (this should never happen unless our code is too inefficient)
    if ((mpuIntStatus2 & 0x10) || fifoCount2 == 1024) {
        // reset so we can continue cleanly
        mpu2.resetFIFO();
        Serial.println(F("FIFO overflow!"));

    // otherwise, check for DMP data ready interrupt (this should happen frequently)
    } else if (mpuIntStatus2 & 0x02) {
        // wait for correct available data length, should be a VERY short wait
        while (fifoCount2 < packetSize2) fifoCount2 = mpu2.getFIFOCount();

        // read a packet from FIFO
        mpu2.getFIFOBytes(fifoBuffer2, packetSize2);
        
        // track FIFO count here in case there is > 1 packet available
        // (this lets us immediately read more without waiting for an interrupt)
        fifoCount2 -= packetSize2;

        #ifdef OUTPUT_READABLE_YAWPITCHROLL
            // display Euler angles in degrees
            mpu.dmpGetQuaternion(&q2, fifoBuffer2);
            mpu.dmpGetGravity(&gravity2, &q2);
            mpu.dmpGetYawPitchRoll(ypr2, &q2, &gravity2);
            mpu2.resetFIFO();
            Serial.print("CMP2:");
            Serial.print(ypr2[0] * 180/M_PI);
            Serial.print(":");
            Serial.print(ypr2[1] * 180/M_PI);
            Serial.print(":");
            Serial.println(ypr2[2] * 180/M_PI);
        #endif


    }

      
    }

}
