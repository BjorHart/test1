# Summer-Intern-Project-2019
This repo is for the Summer Interns 2019 and their robotic arm project.

The repo contains folders with essential documentation and setup instructions for all major parts of the project.
There is also a Quick setup-guide for launching the Digital Twin, provided that all other elements are configured correctly.
Below is a list of the folders followed by a short introduction to the content in each folder for faster navigation.

#### Quick setup-guide
If both arduino boards have all pins correctly placed (according to the documentation) and the braccio-board is connected to the right YUN, the following steps are required to launch the complete application

1. Plug arduinos and braccio into a power outlet. Wait for blue lights to appear on both arduino YUN boards (indicating connected to WIFI), if they dont appear, see further documentation for setup.
2. On the virtual machine; run run.bat located in the Summer interns folder. This will start the runtime simulation of the robotic arm as well as start the Vuforia server.
3.  Grab a tablet or a hololens, scan the Thingmark (number XXXXX) and start viewing the Digital Twin.  Go to http40.115.24.348080ThingworxComposerAppsComposerindex.html and view the web-app for the Digital twin.

## List of topics
1. [Arduino](#of1)
2. [Branding](#of2)
3. [CAD](#of3)
4. [FEM&ROM](#of4)
5. [paho.mqtt.python](#of5)
6. [RuntimePythonForTwin](#of6)
7. [Thingworx](#of7)
8. [Vuforia](#of8)
9. [Physical setup](#of9)

a name=of1a
## Arduino
Contains all the code used on the two Arduinos, from the libraries used, the code, to how the physical setup was done

a name=of2a
## Branding

a name=of3a
## CAD
Includes various CAD files for the robotic arm
1. Spaceclaim files for both complete model and idealized model for simulation.
2. Creo files for export to Vuforia
3. Stl files for 3D-printed parts


a name=of4a
## FEM&ROM
Contains files and documentation of solver used and reduced order model (ROM) generation process.


a name=of5a
## paho.mqtt.python


a name=of6a
## RuntimePythonForTwin
Includes files and documentation for the python scripts running the ROM of the robotic arm and performing damage calculation.

a name=of7a
## Thingworx

a name=of8a
## Vuforia
Includes all versions of the Vuforia projects for both IPad and Hololens. Also AR graphics and Thingmarks are included. 
a name=of9a
## PhysicalSetup