

## MPU6050 setup

# Sensor 1

VCC -> 5V
GND -> GND
SCL -> SCL
SDA -> SDA
AD0 -> 3V3
INT -> Digital pin 8 (if using DMP)

# Sensor 2

VCC -> 5V
GND -> GND
SCL -> SCL
SDA -> SDA
AD0 -> GND
INT -> Digital pin 9 (if using DMP)

2 * 10K pull up resistors on SDA and SCL line (to 5V). 

![alt text](https://components101.com/sites/default/files/component_pin/MPU6050-Pinout.png)

![alt text](https://5.imimg.com/data5/XI/MH/MY-43948449/arduino-yun-board-500x500.jpg)