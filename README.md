# Summer-Intern-Project-2019
This repo is for the Summer Interns 2019 and their robotic arm project.

The repo contains folders with essential documentation and setup instructions for all major parts of the project.
There is also a Quick setup-guide for launching the Digital Twin, provided that all other elements are configured correctly.
Below is a list of the folders followed by a short introduction to the content in each folder for faster navigation.

#### Quick setup-guide
If both Arduino boards have all pins correctly placed (according to the documentation) and the braccio-board is connected to the right YUN, the following steps are required to launch the complete application.



1. Plug both Arduinos and the Braccio robotic arm into a power outlet. Wait for constant blue lights to appear on both Arduino Yún boards (indicating connected to WIFI, may take 2-3 minutes). If constant blue lights dont appear after a minute or two, the arduinos must be connected to a local WIFI. This is done in the following way (repeated for both arduinos): 
    1. Connect the arduino to a computer.
    2. Hold the WIFI button (on the side of the arduino) down for ca. 8 seconds, in order to reset the arduinos WIFI settings. this will        enable the computer to connect a temporary arduino WIFI hotspot. 
    3. Connect to the arduino hotspot and go to: 192.168.240.1 in your browser.
    4. When asked for a password, try one of the following: arduino, #EdrMedeso.
    5. After successful login, go to configure on top of the page.
    6. Select wanted WIFI network and enter WIFI password, you may have to connect the arduinos to your computer hotspot with 2.4 GHz as        the arduinos may not be able to connect to all high speed internets.
    7. Choose configure and restart.
    8. The arduino light will now be constant blue. Reinsert the power outlet of the arduino.
  
2. On the virtual machine; run [run.bat](https://github.com/EDRoMedeso/Summer-Intern-Project-2019/tree/master) found above. This will start the runtime simulation of the robotic arm as well as start the Vuforia server.

3.  Grab a tablet or a Hololens, scan the Thingmark (number 34592:1) and start viewing the Digital Twin.  Go to [this web page](http://40.115.24.34:8080/Thingworx/Runtime/index.html#mashup=mockup_v3&forceClose=true&__fromNextGen=7d195fde-35e2-4e1c-8932-2aaecc90e408) and view the webapp for the Digital Twin. Password and Username may be asked for, Henok will know these.



## List of topics
1. [Arduino](#of1)
2. [Branding](#of2)
3. [CAD & Setup](#of3)
4. [FEM&ROM](#of4)
5. [RuntimePythonForTwin](#of5)
6. [Thingworx](#of6)
7. [Vuforia](#of7)

<a name="of1"></a>
## Arduino
Contains all the code used on the two Arduinos, from the libraries used, the code, to how the physical setup was done

<a name="of2"></a>
## Branding
Contains official branding materials and fonts.
<a name="of3"></a>
## CAD & Setup
Includes various CAD files for the robotic arm
1. Spaceclaim files for both complete model and idealized model for simulation.
2. Creo files for export to Vuforia
3. Stl files for 3D-printed parts


The folder also contain a guide on the physical components used and the assembly and set up of physical robotic arm with sensors. 

<a name="of4"></a>
## FEM&ROM
Contains files and documentation of solver used and reduced order model (ROM) generation process.

<a name="of5"></a>
## RuntimePythonForTwin
Includes files and documentation for the python scripts running the ROM of the robotic arm and performing damage calculation.

<a name="of6"></a>
## Thingworx
Contains documentation for the Thingworx platform, including the custom made extensions and the settings necessary to make them work.

<a name="of7"></a>
## Vuforia
Includes all versions of the Vuforia projects for both iPad and Hololens. Also AR graphics and Thingmarks are included. 
