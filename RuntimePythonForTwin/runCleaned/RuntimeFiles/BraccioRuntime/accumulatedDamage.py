import rainflow
import csv
import time as t
import json
import paho.mqtt.client as paho
import os

CUR_DIR = os.path.abspath(os.path.dirname(os.path.realpath(__file__)))

def run_damage_calculation():
    S_u = 50 * 10**6 #ultimate tensile strength
    S_y =  47* 10**6 # yield strength
    time = 0
    a = 0
    remaining_life_in_years = 14.57 # dummy
    while True: #while true makes the loop run until interrupted
        #set start time
        if time == 0 and a == 0:
            tot_run_file = open(CUR_DIR + "\\tot_run.csv", 'r')
            in_tot_run = csv.reader(tot_run_file, delimiter=',')
            for row in in_tot_run:
                pass
                if row:
                    pass
                    previous_runtime = [float(row[0])]
            initalClockTime = t.time()
            tot_runtime = float(previous_runtime[0])
            a += 1



        # run damage computation every 5 seconds
        if (time + initalClockTime - t.time() <= 5):
            #txt_file = open("outputFromTwin.csv", 'r')
            txt_file = open(CUR_DIR + "\\outputFromTwin.csv", 'r')
            in_txt = csv.reader(txt_file, delimiter = ';')

            H1 = []
            H2 = []
            for row in in_txt:
                if row:
                    pass
                    H1.append(row[1])
                    H2.append(row[2])
            H1float = [float(i) for i in H1]
            H2float = [float(i) for i in H2]
            tot_runtime += 5;
            writeTotRun = open(CUR_DIR + "\\tot_run.csv", 'w')
            writer_totRun = csv.writer(writeTotRun, delimiter=';')
            tot_runtime_writerow = [tot_runtime]
            writer_totRun.writerow(tot_runtime_writerow)
            writeTotRun.flush()
            print("total runtime: ", tot_runtime)
            print("current runtime: ", time)

            # construct lists to store fraction for each cycle and extract cycles
            extractH1 = rainflow.extract_cycles(H1float)
            extractH2 = rainflow.extract_cycles(H2float)
            fractionH1 = []
            fractionH2 = []
            extracts = [extractH1, extractH2]
            fractions = [fractionH1, fractionH2]
            Yield = False

            # allocate damage list
            tot_damage = [0, 0]

            # for H1 and H2, do damage accumulation analysis. The analysis uses rainflow -> Goodman correction -> palmgren miners rule.
            for i in range(2):
                for low, high, multi in extracts[i]:

                    # find mean, amplitude and number of cycles
                    S_m = (low + high)*0.5
                    S_a = (abs(high)-abs(low))/2
                    ni = multi

                    #correct for mean stress using Goodman correction
                    S_eff = abs(S_a *(S_u/(S_u - S_m)))
                    x = ((- S_eff/10**6) + 47)/5.33
                    Ni = 10**x
                    if high >= S_y:
                        Yield = True

                    fraction_to_add = ni/Ni
                    fractions[i].append(fraction_to_add)
                tot_damage[i] = sum(fractions[i])
            for i in tot_damage:
                print(i, "a")
            time += 5
            remaining_life_in_years -= 0.0002/(3600*8750 * tot_damage[1])
            print(time)
            print(remaining_life_in_years, "remaining life!")
            running_cost = tot_damage[1]*(10**6)*0.4
            send_dict = {}
            send_dict["DH1"] = round(tot_damage[0]*10**3, 3) #damage is scaled to gived changeing values in the IOT platform
            send_dict["DH2"] = round(tot_damage[1]*10**3, 3)
            send_dict["CurrentRuntime"] = round(time/60, 2)
            send_dict["tot_runtime"] = round(tot_runtime/60, 2)
            send_dict["remaining_life"] = round(remaining_life_in_years, 3)
            send_dict["running_cost"] = round(running_cost, 3)
            data = json.dumps(send_dict)
            #data = "DH1:" + tot_damage[0] + ", DH2:" + tot_damage[1]
            #dataToSend = json.dumps(data)
            client.publish("Damage", data)

#Connect to MQTT
client = paho.Client()
client.connect('195.159.164.54')
client.loop_start()

#run_damage_calculation()
