from twin_runtime.twin_runtime_core import TwinRuntime
import pandas as pd
import csv
import os
import numpy as np
import time as t
import json
import paho.mqtt.client as paho
CUR_DIR = os.path.abspath(os.path.dirname(os.path.realpath(__file__)))
pd.set_option('precision', 12)
pd.set_option('display.max_columns', 20)
pd.set_option('expand_frame_repr', False)

#
dataList = [[0.0, 0, 0]]
listToSend = [[0.0, 0]]
def run_simulation_continously(Client, twin_runtime, print_step_output=True):
    output_names = list(twin_runtime.twin_get_output_names())
    sim_output_list = []
    time = 0
    # fromJson = json.loads(data_coming_in)
    # imported_array = pd.array([element for element in fromJson.values()])
    #format of simulation ['RotationB' 'RotationL' 'RotationM']
    while time <= 5:
        # Getting the outputs for 0 time
        if time == 0:
            initial_output = [0.0] + twin_runtime.twin_get_outputs() ### API CALL
            sim_output_list.append(initial_output)
            initalClockTime = t.time()
            # Gets the stop time of the current simulation step

            #insert code for receiving data, add code to store input

        if (time + initalClockTime - t.time() <= 0.05):
            time_end = time + 0.05
            # Sets the input values - np.array
            testArray = np.array(dataList[0])
            twin_runtime.twin_set_inputs(testArray)
            if print_step_output is True:
                print("Simulating to: {} with inputs {}".format(time_end, testArray))

        # Advance simulation until the next timestep
            twin_runtime.twin_simulate(time_end) ### API CALL
        #Send outputs to thingworx
            # send data:
            listToSend[0] =(twin_runtime.twin_get_outputs())
            #print(listToSend[0])
            finaldata= json.dumps(listToSend[0])
            #print(finaldata)
            Client.publish("Stress", finaldata)
            # convert to Json.dump(listToSend)
        # Reads and stores the simulation results for the current timestep
            sim_output = [time_end] + twin_runtime.twin_get_outputs()  ### API CALL
            sim_output_list.append(sim_output)
            time+= 0.05

            #Trenger ikke funksjonen under?
            if print_step_output is True:
                out_list = twin_runtime.twin_get_outputs() ### API CALL
                for output in out_list:
                    print(output)
    # Returns a dataframe with the simulation results for all timesteps
    output_names.insert(0, 'Time')
    return pd.DataFrame(sim_output_list, columns=output_names, dtype=float)



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
    client = paho.Client()
    # client.on_subscribe = on_subscribe
    client.on_message = on_message
    client.connect('195.159.164.54')
    client.subscribe('#')
    client.loop_start()
    output_dataframe = run_simulation_continously(client,twin_runtime_braccio, print_step_output=True)
    #print("Publ")
    #client.publish("Stress",listToSend[0])
    # Closing the TWIN model

    twin_runtime_braccio.twin_close()

def on_message(client, userdata, msg):
    payload = (json.loads(msg.payload))
    payloaded = [payload.get("lower")+0.0, payload.get("middle"), payload.get("upper")]
    dataList[0]=payloaded
if __name__ == '__main__':
    run()
