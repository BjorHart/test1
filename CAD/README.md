# Intro
This folder contains all the files connected to the 3D-model in some way. It also contains a short guide on how to assemble and set up the physical arm with the sensors.
This folder contains four subfolders;
1. *CAT* - Cat files exported from Spaceclaim for import to Creo, and later export to Vuforia for real time movements in AR-apps.
2. *CREO* - files for export to Vuforia, as creo and Vuforia are very compatible
3. *Housings* - housing for the sensors, stl files for 3D-print
4. *Spaceclaim* - Idealized geometry for FE-model and full geometry for visualization.

## List of topics
1. [*Set Up*](#of1)
2. [*Documentation*](#of2)
3. [*Challenges and Improvements*](#of3)


<a name="of1"></a>
## Set Up
The physical components used in this project are listed below:
- [2 Arduino Yúns](https://www.kjell.com/no/produkter/elektro-og-verktoy/utviklerkit/arduino/utviklingskort/arduino-yun-rev-2-utviklingskort-p87058)
- [Arduino Tinkerkit Braccio Robotarm](https://www.kjell.com/no/produkter/elektro-og-verktoy/elektronikk/kits/arduino-tinkerkit-braccio-robotarm-p87094?gclid=CjwKCAjwzdLrBRBiEiwAEHrAYuRuEVD313vl4q26flIzJzAqYCrtd1ZEdNZlnWwjuAj3fP2obyXD8RoCk14QAvD_BwE&gclsrc=aw.ds)
- [3 Potentiometers](https://www.kjell.com/no/produkter/elektro-og-verktoy/utviklerkit/arduino/moduler/luxorparts-potensiometermodul-for-arduino-p90470)
- [MPU-6050 (Rotation sensor)](https://www.digitalimpuls.no/sensorer/135275/gy-521-breakout-board-mpu-6050-3-axis-analog-gyro-plus-3-axis-accelerometer)
- [HX711 load cell](https://www.banggood.com/no/HX711-Weigh-Module-5kg-Pressure-Sensor-Kit-Weighing-Sensor-Electronic-Scale-Module-p-1442951.html?gmcCountry=NO&currency=NOK&createTmp=1&utm_source=googleshopping&utm_medium=cpc_bgs&utm_content=xibei&utm_campaign=xibei-pla-no-rm-all-no-pc-0331&gclid=CjwKCAjwzdLrBRBiEiwAEHrAYlvgM75OaBGLGzNgk-scdTsiOau1XuI13FAtACoOxzupjrI6hYOPNRoC1bkQAvD_BwE&cur_warehouse=CN)
- [Breadboard and resistors](https://www.kjell.com/no/produkter/elektro-og-verktoy/utviklerkit/arduino/arduino-pakke/luxorparts-oppstartspakke-for-arduino-p87966)
- [Different variants of connector cables](https://www.kjell.com/no/produkter/elektro-og-verktoy/utviklerkit/arduino/tilbehor/luxorparts-koblingskabel-som-kan-deles-40-polet-hann-hann-p87901)
- [Epoxy glue](https://www.kjell.com/no/produkter/hjem-kontor-fritid/kontorstilbehor/kjemi-spray-lim/lim-heftemasse/loctite-power-epoxy-mini-lim-p53364)
- [Electrical tape](https://www.kjell.com/no/produkter/hjem-kontor-fritid/kontorstilbehor/teip/el-teip-20-m-svart-p40104)
- [2 Micro-USB Cables](https://www.kjell.com/no/produkter/data-og-nettverk/kabler-og-adaptere/usb/usb-kabler/micro-usb-kabel-1-m-p68687)
- [The housings for the sensors](https://github.com/EDRoMedeso/Summer-Intern-Project-2019/tree/master/CAD/Housings)

How to assemble and attach the different sensors to the robotic arm are a bit difficult to explain with words, but following are a short explanation.
The custom made housings for the potentiometers need to be printed out on at 3D printer (with . We used a [Ultimaker 2+](https://ultimaker.com/3d-printers/ultimaker-2-plus) with the program [Cura](https://ultimaker.com/software/ultimaker-cura) where you import the STL files found in [Housings](https://github.com/EDRoMedeso/Summer-Intern-Project-2019/tree/master/CAD/Housings) subfolder. The print should be preferably be printed on the best quality and probably need to be divided up in two parts (unless you have 12+ hours with the printer).
The middle and upper housings are then glued onto the robotic arm with epoxy glue. The lower housing is made up of two parts, and the sensor (potentiometer) needs to be glued onto the housing before glued onto the robotic arm. To make the potentiometers fit must the metallic cap be removed, the black plastic must then be cut and sanded with sandpaper to the perfect length. The lower sensor circuit board must also be cut to fit inside the housing. The potentiometers are then glued (with epoxy glue) onto a screw from the robotic arm inside the housing/case for the sensors. Before doing this is it important that the potentiometers are set to 90 degrees (use Arduino code to do this) and that the arm are set to be straight up (extended to maximum length in each joint). It is also important to let the glue congeal and stick properly before moving the arm (minimum 30 minutes in our tests).
The installation of the weight sensors is dependent on a custom made wood box as well as some custom made fixes to make it fit perfectly in the box under the robotic arm. The best way to understand this is to examine the box already built. The rotation sensor is just connected with electrical tape to the base of the robotic arm. The guide for the assembly of the Braccio robotic arm is included in the box with the robotic arm. How to connect the sensors to the Arduinos are explained in the  [Arduino](https://github.com/EDRoMedeso/Summer-Intern-Project-2019/tree/master/Arduino) folder.

<a name="of2"></a>
## Documentation


<a name="of3"></a>
## Challenges and Improvements

We have experienced a lot of challenges when assembling and attaching the sensors to the robotic arm, so be prepared that this could take time and that you probably need a few tries before it works as wanted.