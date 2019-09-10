# Intro
This folder contains three subfolders:
1. *learningData* - containing learning data used to generate the dynamic rom in the Twin Builder extension Dynamic ROM Builder.
2. *FEM* - the workbench model of the robotic arm. Here the setup with all the rigid dynamic simulation cases can be viewed.
3. *ROM* - the ROM used for real time simulation and a pdf with intro on how to use the Dynamic ROM Builder.

## List of topics
1. [*Documentation*](#of2)
2. [*Challenges and Improvements*](#of3)

<a name="of2"></a>
## Documentation
#### FEM & ROM
Ansys rigid dynamics is used for simulation and generating the learning data for the Dynamic ROM. 
At first, all parts of the robotic arm were condensed, and all joints used as input to the dynamic rom generator. 
This however was too complex for the ROM builder to give satisfactory results when validated and long simulation and expansion-times were experienced. This led to the use of only base, lower and middle joints in the ROM generation process in order to reduce the overall complexity.
Hotspot analysis showed stress concentraions beiing the highest in the "lower arm", so all parts below the lower joint and above the middle were modelled as rigid.


A total of 9 learning datasets were used, with a timestep of 0.05 seconds and a total simulation time of 50 seconds. The overall process can be viewed closer in a pdf in the ROM-folder.


<a name="of3"></a>
## Challenges and Improvements
#### ROM
1. The Twin Builder extension Dynamic ROM Builder is, when used the right way, rather "plug and play", but there are limitations to its applications. The number of inputs+outputs should not exceed 5 (from experience and consultation with Ansys in Belgium).
2. The outputs should be recorded on the same node throughout the simulation (as an example, not a maximum stress in the structure during simulation).
3. The robustness of the ROM is limited, if subjected to data far from the trianing data, it may give very high stress results
4. If under operation, the physical robotic arm stops at zero degrees for all joints for a longer period of time, the real-time stress values from the ROM will at first converge and stabilize, but then after a while start to oscillate.
5. Accuracy of the ROM is seen to vary depending on the input rotations. The below figure shows the correlation between simulated stresses for the same input in Ansys and the ROM. The plot is for a arbitrary representative operation of the robotic arm.

![alt text](https://github.com/EDRoMedeso/Summer-Intern-Project-2019/blob/master/FEM%26ROM/ROM/ComparisonPlot.PNG)


