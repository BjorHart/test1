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
These are found in the "runCleaned/Runtimefiles/BraccioRuntime" folder. 

<a name="of2"></a>
## Documentation
#[*application.py*]
The application.py script runs the braccio dynamic ROM as a ".twin"-file. All operations on the ".twin" are based on the "twinRuntime" library provided by XXXXXXXXXXXXXXXXXX. The twin_runtime_core function twin_simulate() is used to simulate the ROM one timestep (0.05 s) for each iteration.
Output data from the simulation is both sent to the IOT platform, and stored locally for damage accumulation calculation.

Real time butterworth filtering of the incoming sensor data is done by the help of the IIR2filter library. Data is received and sent using standard MQTT calls/protocol.

#[*accumulatedDamage.py*]
Stress data from simulation is imported from a .csv into a python list. Accumulated damage calculation based on rainflow cycle counting, goodman mean stress correction and palmgren miners rule is applied. Results are sent to the IOT platform every 5 seconds.



<a name="of3"></a>
## Challenges and Improvements

Deep lake




### Disclaimer
The following code was entirely or partly copied: