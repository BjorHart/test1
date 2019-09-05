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
    * Always remember to export your edited Project, label it correctly, and upload it to Git!

<a name="of2"></a>
## Documentation


<a name="of3"></a>
## Challenges and Improvements

* Time Series Charts
    - The Time Series Charts has proven to be a difficult feature to manage in Vuforia Studio. After doing some research on PTC´s community we found clear signs that the Time Series Chart currently is under heavy limitations. Although you can customize a chart visually, there are few features for auto-scaling, plotting multiple data points, auto-refreshing, etc.. 
    - It will be difficult to improove the Time Series Chart until Vuforia brings a update, we therefore recommend shying away from using this feature for the time being.
* 




### Disclaimer
The following code was entirely or partly copied: