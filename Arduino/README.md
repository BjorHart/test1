# Intro
This folder contains all the code used on the two Arduinos, from the libraries used, the code, to how the physical setup was done.

The folder contains three sub folders:
1. *Examples_and_test_code* - Contains examples used, small bits of the code used in production, code used in testing the arm and calibrating it, as well as some experimental code not implemented in the final version.
2. *finalVersion* - Contains the the code that currently are running on the two Arduinos.
3. *Setup_and_libraries* - Contains the libraries used and the physical setup documentation.

## List of topics
1. [*Set Up*](#of1)
2. [*Documentation*](#of2)
3. [*Challenges and Improvements*](#of3)


<a name="of1"></a>
## Set Up
A sketch of how the sensors are connected to the Arduino and breadboard are found below. Further details on the wire connections and input ports etc. can be found in the document [Arduino_sensors_connection.pdf](https://github.com/EDRoMedeso/Summer-Intern-Project-2019/tree/master/Arduino/Setup_and_libraries/Arduino_sensors_connection.pdf).
![alt text](https://github.com/EDRoMedeso/Summer-Intern-Project-2019/blob/master/Arduino/Setup_and_libraries/sensor_setup_png.png)

To be able to run all the code yo need to firstly need to install the Arduino IDE from the [Arduino Website](https://www.arduino.cc/en/Main/Software).
There are also some libraries the needs to be installed these are:
- PubSubClient by Nick O'Leary
- ArduinoJson by Benoit Blanchon
- BraccioRobot by Stefan Strømberg
- HX711_ADC by Olav Kallhovd
- I2Cdev
- MPU6050_6Axis_MotionApps20
Install these libraries from Sketch>Include Libraries>Manage Libraries in the Arduino IDE or manually by importing them from the [Setup_and_libraries](https://github.com/EDRoMedeso/Summer-Intern-Project-2019/tree/master/Arduino/Setup_and_libraries) subfolder.

The MQTT broker used for communication between the Arduino and the Thingworx platform is installed and running on the Arduino connected to all the sensors, how to to this can be seen in this [guide](https://www.youtube.com/watch?v=rL7dV3rNpGU).
<a name="of2"></a>
## Documentation
There are two subfolders found inside the [finalVersion](https://github.com/EDRoMedeso/Summer-Intern-Project-2019/tree/master/Arduino/finalVersion) folder, [roboticArmCode](https://github.com/EDRoMedeso/Summer-Intern-Project-2019/tree/master/Arduino/finalVersion/roboticArmCode) and [transmitSensorData](https://github.com/EDRoMedeso/Summer-Intern-Project-2019/tree/master/Arduino/finalVersion/transmitSensorData).
The roboticArmCode contains the code used by the Arduino connected to the Braccio robotic arm. The code contains a setup for connection to the MQTT Broker which allows the arm to subscribe and receive commands from the iPad AR app. These commands then determine which program the Braccio robot arm should run. These programs are:
- *Pause* - Set the arm to the pause position  
- *Program1* - Runs a program where the robot picks up a sets down a box/sponge in a loop.
- *Program2* - Runs a program where the robot do different movements with the arm, in some cases to the most extreme positions possible.
- *Program3* - Runs a program where the robot do different movements with the arm including rotation.
- *Program4* - Runs a program where the robot is set to a position optimized for the Hololens experience.

The transmitSensorData contains the code used by the Arduino connected to all the sensors. There are 6 different files in the folder:
- transmitSensorData.ino - Collects and sends all the sensor data via MQTT (found below)
- MQTT_JSON.ino - Connects and publish data to the correct MQTT Channel
- simpleWeightSensor.ino - Reads the data from the weight sensor.
- readPotAngle.ino - Reads the data from the potentiometers and converts it to degrees.
- MPU6050_DMP6.ino - Reads the data from the MPU6050 sensor and converts it to rotation. Originially written by Jeff Rowberg, made some modifications to fit our purpose.
- anomalyDetection.ino - Meant to be used to see if it possible to do some anomaly detection on the Arduino (not used).


<a name="of3"></a>
## Challenges and Improvements
There are some challenges and proposed improvements worth to notice.
1. *Commands not working perfect* - When sending program commands from the iPad app, must the current movement (move to a specified position) finish before it is performing a new command, it then resumes on the previous program (the remaining movements) when the given command is done.
- Proposed fix: We have tried some small fixes (with no success) but with limited time was this not prioritized to fix. There could however be a solution to make the break; function work (as seen commented out in program1()). This can maybe be done by creating a while loop that always runs while a boolean value is set to true, but when it's changed (a new different command is received) the value is changed to False and the program then breaks out of the while loop. This could roughly explained be a possible solution that's not been tried.

2. *Weight sensor* - The weight sensor is working but may need some recalibration in measuring the correct weight. There is also a problem that the sensor output changes when the arm moves (best to see the output with the arm moving to understand the problem)
- Proposed fixes: The recalibration can be done with known weights and the changing the factor used in [simpleWeightSensor.ino](https://github.com/EDRoMedeso/Summer-Intern-Project-2019/tree/master/Arduino/finalVersion/transmitSensorData/simpleWeightSensor.ino). The problem with arm moving may be fixed by implementing some kind of filter which compensate for the angle and speed of the arm to remove the erroneous measurements. This could be hard to do but could remove some of the erroneous data.

3. *Correct angles* - There are sometimes a problem with the readings from the potentiometers on the lower, middle and upper arm where the data reading jumps to a wrong value (example jumping from 11 to 173). The factor used to compensate and get roughly the correct values from the arm found in [transmitSensorData.ino](https://github.com/EDRoMedeso/Summer-Intern-Project-2019/tree/master/Arduino/finalVersion/transmitSensorData/transmitSensorData.ino) could need some small changes to get the data to correspond more to the angles on the real robotic arm.
- Proposed fixes: Ensure that all the physical cables are connected properly and correctly. May need to implement a filter which disregards large jumps in values (example a jump of more than 30 degrees). As mentioned may the calculation made to compensate for the incorrect sensor readings be changed to be more correct.

4. *Rotation sensor(IMU-MPU6050)*

The sensor works great for 10-15 minutes before it crashes(Hangs up in a while loop). This is a known issue with this particular sensor. A reason for this is believed to be in the Wire.h library, however the time haven’t been there to debug this particular library.
Adding two 2K pull up resistors on the SCL and SDA lines made the sensor work for a bit longer, however its not reliable. If you make it work with this sensor we would appreciate to know what the issue was.

5. *No blue light on the Arduinos*
In case where there is no blue light or the blue light is blinking for more than 1 minute do the Arduinos have a network connection problem. This can be fixed by ensuring that the Arduinos are connected to the correct network and are close enough to the router. 

6. *No data is sent from the Arduino*
If the Arduinos are connected to a network and there is still no data. Check that both the Arduinos and Thingworx are set up to be connected to the MQTT Broker (click save on the MQTT_Duplicate and see a green icon on the top left in Thingworx) running on one of the Arduinos. If the connection is correct, try uploading the code to the Arduino with all the sensors again. It is possible to check if there is data sent with an app also (just search for MQTT on an App Store or the web) and input the same settings as on the Arduinos/Thingworx (Default: 195.159.164.54, port: 1883, Topic: Data).

Relevant thread:

https://www.bountysource.com/issues/35448341-mpu6050-with-dmp-active-hangs-indefinitely-using-arduino-wire-library

This can be avoided by using the complementary filter which do not utilize the on board DPU. However, the complementary filter to not give a yaw measurement. 
