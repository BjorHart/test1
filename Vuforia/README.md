# Intro
The folder focuses on the Vuforia part of the project and contains all relevant information regarding our work done in Vuforia Studio.

The folder contains three sub folders:
1. *Graphics* - Contains graphics used in iPad AR application
2. *Projects* - Contains all versions of both the iPad AR application and the Hololens AR application.
3. *Thingmarks* - Contains relevant Thingmarks that are connected to the Vuforia Experience Server.

##### *Before digging into our Vuforia Project we do **strongly recommend** to take the course [Fundamentals of AR Development with Vuforia Studio](https://www.ptcu.com/enrollment/student/fundamentals-of-ar-development-with-vuforia-studio) by PTC.*
## List of topics
1. [*Set Up*](#of1)
2. [*Documentation*](#of2)
3. [*Challenges and Improvements*](#of3)


<a name="of1"></a>
## Set Up
In order to make changes or publish the Vuforia AR Experience you need to perform the following steps:

1. Install [Vuforia Studio](https://www.ptc.com/en/products/augmented-reality/vuforia-studio "Vuforia Studio")
2. Enter ´localhost:3000´ in your browser
    * The port number may differ depending on your Vuforia setup.
    * One could potentially run into trouble using Microsoft Edge, we do recommend using Google Chrome.
3. Log in using the **Virtual Machine** Vuforia credentials
4. Import the desired Project version found in the [Projects](https://github.com/EDRoMedeso/Summer-Intern-Project-2019/tree/master/Vuforia/Projects) subfolder.
    * Now you should be able to edit the Project by clicking on the project in the Vuforia Studio dashboard (the project will have the same name as the imported file)
    * Always remember to add the right Vuforia Experience Server and Thingmark before publishing your experience!
        * Experience Server per 08.09.19 should be: http://40.115.24.34:2019
        * Thingmark per 08.09.19 should be: 34592:1
    * Always remember to export your edited Project, label it correctly, and upload it to Git!

<a name="of2"></a>
## Documentation

### iPad AR Experience
The iPad AR Experience is designed to be easy to manage and easy to navigate through. It consists of a navigation bar consisting of three tabs and one button, *HOME*,*STATISTICS*, *MOVEMENTS* and *CONTACT US*.
    - *HOME*: This tab is mainly used for displaying live motion, observing live data and inspecting parts. By clicking on the Robot Arm a live display will appear at the top of the screen, as well as a gauge showing stress at the lower hotspot. By clicking on one or multiple motors and sensor housings a highlight feature will be triggerd. This can be undone by clicking on the selected part once again. 
    - *STATISTICS*: This tab is used for displaying historic data for the different joints. It is designed with focus towards easy navigation between different joints, however the graph is not the best looking as for now, a more detailed explanation of this can be found under **Challenges and Improvements**.
    - *MOVEMENTS*: This tab is used for playing desired movements. It consists of four buttons, where three plays different movements and one for stopping a movement.
    - *CONTACT US*: This button redirects the user to EDR & Medeso´s home page. 
    
<a name="of3"></a>
## Challenges and Improvements

* Time Series Charts
    - The Time Series Charts has proven to be a difficult feature to manage in Vuforia Studio. After doing some research on PTC´s community we found clear signs that the Time Series Chart currently is under heavy limitations. Although you can customize a chart visually, there are few features for auto-scaling, plotting multiple data points, auto-refreshing, etc.. 
    - It will be difficult to improove the Time Series Chart until Vuforia brings a update, we therefore recommend shying away from using this feature for the time being.
* Joint movement
    - One of our big challenges during was to enable the Robot Arms ability to rotate about joints in Vuforia Studio. We did however find a very good solution to this. By using the PTC software [Creo Parametric](https://www.ptc.com/en/products/cad/creo/parametric) we were able to divide our Robot Arm into Assemblies and Subassemblies which the Vuforia Studio software recognized, thereby we could divide our Robot Arm into different items and then implement application parameters to the desired items. A more detailed guide of this process can be found [here](https://community.ptc.com/t5/Vuforia-Studio/Mechanism-Concept-in-Vuforia-Studio-How-to-make-rotation-more/td-p/552743).




### Disclaimer
The following code was entirely or partly copied: