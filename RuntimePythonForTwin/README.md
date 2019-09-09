# Intro
This folder contains all python code used for running the Braccio dynamic ROM and damage calculations. There are two scripts running simoultainosly in real time under operation of the robotic arm:
1. *application.py* - contains all operations to run the ROM real time
2. *accumulatedDamage.py* - performs damage calculations based on simulated data.

In the documentation section some key elements are described. See the python files for further step by step comments.

## List of topics
1. [*Set Up*](#of1)
2. [*Documentation*](#of2)
3. [*Challenges and Improvements*](#of3)


<a name="of1"></a>
## Set Up
In order to do real time damage and stress calculations, the two scripts application.py and accumulatedDamage.py both need to be run. These however are run automatically by launching run.exe.
They are both found in the "runCleaned/Runtimefiles/BraccioRuntime" folder. 

<a name="of2"></a>
## Documentation
#### *application.py*
The application.py script runs the braccio dynamic ROM as a ".twin"-file. All operations on the ".twin" are based on the "twinRuntime" library. The twin_runtime_core function twin_simulate() is used to simulate the ROM one timestep (0.05 s) for each iteration.
Output data (stress at given hotspots) from the simulation is both sent to the IOT platform, and stored locally for damage accumulation calculation.

Real time butterworth filtering of the incoming sensor data is done by the help of the IIR2filter library. Data is received and sent using standard MQTT calls/protocol.

#### *accumulatedDamage.py*
Stress data from simulation is imported from a .csv into a python list. Accumulated damage calculation based on rainflow cycle counting, goodman mean stress correction and palmgren miners rule is applied. Results are sent to the IOT platform every 5 seconds.



<a name="of3"></a>
## Known Challenges and Improvements
1. The logged stress data are overwritten if the script is stopped and re-run, this extends to the accumulated damage calculation. In order to cope with the case of stopped simulation, this needs to be adressed for the accurate continued damage calculation.
2. The stress data from the ROM compared to Ansys rigid dynamics result with identical input can be seen in the figure below. Not flawless!
3. A discovery was made that if the braccio stops at the 0 degree position for all joints, the stress data will stabilize before starting to osccillate, the reason for this has not been determined.	 
4. Remaining lifetime calculation a dummy calculation for display purposes.



### Disclaimer
The code in this folder was entirely or partly copied from previous EDR Medeso work and/or other online sources.
