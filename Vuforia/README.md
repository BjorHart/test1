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
The iPad AR Experience is designed to be easy to manage and easy to navigate through. It consists of a navigation bar with three tabs and one button:

- ***Home***: This tab is mainly used for displaying live motion, observing live data and inspecting parts. By clicking on the Robot Arm a live display will appear at the top of the screen, as well as a gauge showing stress at the lower hotspot. By clicking on one or multiple motors and sensor housings a highlight feature will be triggerd, also for motors a specification panel will appear. This can be undone by clicking on the selected part once again.
- ***Statistics***: This tab is used for displaying historic data for the different joints. It is designed with focus towards easy navigation between different joints, however the graph is not the best looking as for now, a more detailed explanation of this can be found under **Challenges and Improvements**.
- ***Movements***: This tab is used for playing desired movements. It consists of four buttons, where three plays different movements and one for stopping a movement.
- ***Contact us***: This button redirects the user to EDR & Medeso´s home page.

### Hololens AR Experience
***Disassembly***: Click on one of the parts ‘middle arm’, ‘lower arm’, ‘upper servo’ or ‘middle servo’ to highlight and isolate the specific part. This can also be done with voice commands by saying their respective names. The specifications of the servos is displayed when highlighting one of the servos. A map of voice commands together with their functions is displayed above the robot arm to assist, this is made for first time users.  The model is reset to default view by double clicking on the pointer/cursor.

***Live***: Change to the 'live' view with the voice command ‘home’. In this view one can observe the real time movement of the physical twin in the same way as on the iPad experience.

<a name="of3"></a>
## Challenges and Improvements

* Time Series Charts
    - The Time Series Charts has proven to be a difficult feature to manage in Vuforia Studio. After doing some research on PTC´s community we found clear signs that the Time Series Chart currently is under heavy limitations. Although you can customize a chart visually, there are few features for auto-scaling, plotting multiple data points, auto-refreshing, etc..
    - It will be difficult to improove the Time Series Chart until Vuforia brings a update, we therefore recommend shying away from using this feature for the time being.
* Joint movement
    - One of our big challenges during was to enable the Robot Arms ability to rotate about joints in Vuforia Studio. We did however find a very good solution to this. By using the PTC software [Creo Parametric](https://www.ptc.com/en/products/cad/creo/parametric) we were able to divide our Robot Arm into Assemblies and Subassemblies which the Vuforia Studio software recognized, thereby we could divide our Robot Arm into different items and then implement application parameters to the desired items. A more detailed guide of this process can be found [here](https://community.ptc.com/t5/Vuforia-Studio/Mechanism-Concept-in-Vuforia-Studio-How-to-make-rotation-more/td-p/552743).
* Alert Triggering
    - We currently have a issue regarding our exceeding stress limits alert. The issue does however not lie in the Vuforia Studio implementation but in the weight sensor. The alert is supposed to be triggered when the weight sensor exceeds a given treshold, which in practice does not work so well. This comes as an effect of the weight sensors placement, as well as the robot arm shifting its weight when moving.

#### Hololens specific challenges

The development of the Hololens experience is in many ways the same as for the iPad. However, there are some differences and known issues:

* When triggering functions with ‘Click’ in the Hololens the function is not triggered, on can observe the model become       grey etc. To avoid this, ‘app.’ was placed in front of the function call. This enables functions to be triggered by e.g. clicking on a specific part on the 3D model, in this case the ‘middle_arm’.




![alt text](https://github.com/EDRoMedeso/Summer-Intern-Project-2019/blob/master/Documentation/hololens_doc_img/event_printscreen.png)




This was also included in the function header.
![alt text](https://github.com/EDRoMedeso/Summer-Intern-Project-2019/blob/master/Documentation/hololens_doc_img/functionHeader_printscreen.png)

* Switching between sequences from Creo Illustrate. When uploading a resource as a ‘.pvz’ file made in Creo Illustrate one can select between different sequences made for the particular resource. This works perfectly in the ‘Preview’ mode. However, this did not work when publishing it on the Hololens. A workaround for this was to convert the ‘.pvz’ file from Creo Illustrate to a ‘.zip’ file, simply by adding ‘.zip’ to the file name. Next was to extract the ‘.zip’ which shows the ‘.pvi’ files inside. Upload these ‘.pvi’ files to Vuforia studio and switch between these to play different sequences e.g. by clicking.


![alt text](https://github.com/EDRoMedeso/Summer-Intern-Project-2019/blob/master/Documentation/hololens_doc_img/function_printscreen.png)


```javascript
$scope.view.wdg[‘Name of model‘][‘sequence'] = ‘Path to .pvi file’;
```

The program needs time to load the next sequence. Thats why a timeout was added before ‘playAll’ was triggered.

```javascript
$timeout(function() {
$scope.$broadcast(‘app.view[‘Name of view’].wdg[‘Name of model’].svc.playAll');
$scope.$applyAsync()
}
, ‘timeout period in ms’);
};
```

* When triggering functions with voice commands or gestures, the function needs to be an application event. In addition, ‘viewCtrl.’ needs to be added in front of the function name.
   No change in the JS script is needed.



![alt text](https://github.com/EDRoMedeso/Summer-Intern-Project-2019/blob/master/Documentation/hololens_doc_img/appEvent_printscreen.png)



* It’s important that the marker width corresponds to the printed marker to make the AR model appear correctly on the ThingMark.



![alt text](https://github.com/EDRoMedeso/Summer-Intern-Project-2019/blob/master/Documentation/hololens_doc_img/markerWidth_printscreen.png)


* Example with making 3D image visible


![alt text](https://github.com/EDRoMedeso/Summer-Intern-Project-2019/blob/master/Documentation/hololens_doc_img/function2_printscreen.png)

```javascript
$scope.view.wdg[‘name of uploaded image file']['visible'] = true;
```


Apart from this a lot of information can be found in the javascript and in the PTC community forums
