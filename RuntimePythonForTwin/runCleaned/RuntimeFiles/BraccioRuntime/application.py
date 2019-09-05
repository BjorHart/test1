from twin_runtime.twin_runtime_core import TwinRuntime
import pandas as pd
import csv
import os
import numpy as np
import time as t
import json
import paho.mqtt.client as paho
import matplotlib.pyplot as plt
from IIR2Filter import IIR2Filter

#----------------------------------------------------------
#filterproperties for butterworth lowpass filter, sample by sample filtering
order = 6
cutoff = 0.06
filterType = 'lowpass'
MyFilter1 = IIR2Filter(order,cutoff,filterType,design='butter',rp=1,rs=1,fs=0)
MyFilter2 = IIR2Filter(order,cutoff,filterType,design='butter',rp=1,rs=1,fs=0)
MyFilter3 = IIR2Filter(order,cutoff,filterType,design='butter',rp=1,rs=1,fs=0)
#----------------------------------------------------------

CUR_DIR = os.path.abspath(os.path.dirname(os.path.realpath(__file__)))
pd.set_option('precision', 12)
pd.set_option('display.max_columns', 20)
pd.set_option('expand_frame_repr', False)

#allocate data arrays to be sent and received
dataList = [[0.0, 0, 0]]
weight_payloaded = [[0.0]]
listToSend = [[0.0, 0]]
weight_adjusted = np.array([0.0])

#----------------------------------------------------------
#The run_simulation_continously function does all operations to the robotic arm .twin, in order to do real time simulation.

def run_simulation_continously(Client, twin_runtime, print_step_output=True):
    output_names = list(twin_runtime.twin_get_output_names())
    writeFile = open("outputFromTwin.csv", 'w')
    output_csv = csv.writer(writeFile, delimiter=';')

    sim_output_list = []
    sim_input_list = []
    time = 0
    filtered = [0, 0, 0]
    #format of simulation inputs ['RotationB' 'RotationL' 'RotationM']
    while True:
        # Getting the outputs for 0 time
        if time == 0:
            initial_output = [0.0] + twin_runtime.twin_get_outputs() ### API CALL
            sim_output_list.append(initial_output)
            initalClockTime = t.time()


        if (time + initalClockTime - t.time() <= 0.05):
            time_end = time
            # Sets the input values - np.array
            testArray = np.array(dataList[0])
            weight_adjusted = np.array(weight_payloaded[0])
            testArray[1] = -testArray[1]
            testArray[2] = -testArray[2]
            filtered[0] = MyFilter1.filter(testArray[0])
            filtered[1] = MyFilter2.filter(testArray[1])
            filtered[2] = MyFilter3.filter(testArray[2])
            filteredArray = filtered
            twin_runtime.twin_set_inputs(filteredArray)
            sim_input_list.append([float(filteredArray[i]) for i in range(3)])
            if print_step_output is True:
                print("Simulating to: {} with inputs {}".format(time_end, filteredArray))

        # Advance simulation until the next timestep
            twin_runtime.twin_simulate(time_end) ### API CALL
        #Send outputs to thingworx
            # send data:
            listToSend[0] =(twin_runtime.twin_get_outputs())
            #print(listToSend[0])'

            #send values for H1 and H2 stress values, scaled to MPa and rounded to 3 decimals
            send_dict = {}
            send_dict["H1"] = round(listToSend[0][0]*10**(-6), 3)
            send_dict["H2"] = round(listToSend[0][1]*10**(-6), 3)
            #print("adjusted: ", weight_adjusted_value)
        # convert to Json.dump(listToSend)
            data = json.dumps(send_dict)
            finaldata = data
            #print(finaldata)
            Client.publish("Stress", finaldata)

        # Reads and stores the simulation results for the current timestep
            sim_output = [time_end] + twin_runtime.twin_get_outputs()  ### API CALL
            sim_output_list.append(sim_output)
            output_csv.writerow(sim_output)
            writeFile.flush()
            time+= 0.05

            #Dont need below if-sentence, but good for validating purposes
            if print_step_output is True:
                out_list = twin_runtime.twin_get_outputs() ### API CALL
                for output in out_list:
                    print(output)

    # Returns a dataframe with the simulation results for all timesteps
    output_names.insert(0, 'Time')
    return pd.DataFrame(sim_output_list, columns=output_names, dtype=float), sim_input_list
#----------------------------------------------------------


def run():
    def set_start_values(inArray):
        twin_runtime_braccio.twin_set_inputs(inArray)

    twin_model_file_braccio = os.path.join(CUR_DIR, 'L1_to_9Rom0.05.twin')
    braccio_log = os.path.join(CUR_DIR, 'braccio_log.log')



    # Instantiate Twin Runtime
    twin_runtime_braccio = TwinRuntime(twin_model_file_braccio, braccio_log) ### API CALLL
    twin_runtime_braccio.print_model_info(max_var_to_print=10)  ### API CALL
    print(twin_runtime_braccio.twin_get_input_names())
    testArray = np.array([1, 1, 1])
    twin_runtime_braccio.twin_instantiate()
    set_start_values(testArray)
    twin_runtime_braccio.twin_initialize()  ### API CALL


    print('Running Braccio.twin...')

    #conncect to MQTT broker
    client = paho.Client()
    client.on_message = on_message
    client.connect('195.159.164.54')
    client.subscribe('Data')
    client.loop_start()
    output_dataframe, inputArray = run_simulation_continously(client,twin_runtime_braccio, print_step_output=True)

    # Closing the TWIN model
    twin_runtime_braccio.twin_close()


    dfList = output_dataframe.values.tolist()
    firstList = [i[1] for i in dfList]
    secondList = [i[2] for i in dfList]
    #print(firstList)
    print("inputArray:", inputArray[0][0])
    # x = np.linspace(0, , 1000)
    # print(L1)
    plt.plot(firstList)
    plt.plot(secondList)
    # plt.plot(L2)
    plt.show()

#Mqtt connection stuff
def on_message(client, userdata, msg):
    payload = (json.loads(msg.payload))
    payloaded = [payload.get("rotation")+0.0, payload.get("lower"), payload.get("middle")]
    #payloaded1 = payload.get("weight")
    dataList[0]=payloaded
    #weight_payloaded[0] = payloaded1



#run()
