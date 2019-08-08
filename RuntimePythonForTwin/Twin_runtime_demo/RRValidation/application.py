from twin_runtime.twin_runtime_core import TwinRuntime
from twin_runtime.twin_runtime_core import LogLevel

import matplotlib.pyplot as plt
import pandas as pd
import csv
import os

CUR_DIR = os.path.abspath(os.path.dirname(os.path.realpath(__file__)))
pd.set_option('precision', 12)
pd.set_option('display.max_columns', 20)
pd.set_option('expand_frame_repr', False)


def load_data(twin_builder_inputs, twin_builder_results=None):

    # Clean CSV headers if exported from Twin builder
    def clean_column_names(column_names):
        for name_index in range(1, len(column_names)):
            clean_header = column_names[name_index].replace("\"", "").replace(" ", "").replace("]", "").replace("[","")
            name_components = clean_header.split(".", 1)
            # The column name should match the last word after the "." in each column
            column_names[name_index] = name_components[-1]

        return column_names

    ##### Data loading (into Pandas DataFrame) and pre-processing #######
    # C engine can't read rows with quotes, reading just the first row
    input_header_df = pd.read_csv(twin_builder_inputs, header=None, nrows=1, sep=',\s+', engine='python', quoting=csv.QUOTE_ALL)
    # Reading all values from the csv but skipping the first row
    twin_builder_inputs_df = pd.read_csv(twin_builder_inputs, header=None, skiprows=1)
    # Parsing column names correctly
    inputs_header_values = input_header_df.iloc[0][0].split(',')
    # Cleaning csv column names to match the twin output names
    clean_column_names(inputs_header_values)
    # Adding column names back
    twin_builder_inputs_df.columns = inputs_header_values
    
    twin_builder_results_df = None
    if twin_builder_results:
        output_header_df = pd.read_csv(twin_builder_results, header=None, nrows=1, sep=',\s+', engine='python', quoting=csv.QUOTE_ALL)
        twin_builder_results_df = pd.read_csv(twin_builder_results, header=None, skiprows=1)    
        output_header_values = output_header_df.iloc[0][0].split(',')
        clean_column_names(output_header_values)
        twin_builder_results_df.columns = output_header_values

    return twin_builder_inputs_df, twin_builder_results_df


def run_simulation_step_by_step(twin_runtime, input_df, print_step_output=True):
    output_names = list(twin_runtime.twin_get_output_names())

    data_dimensions = input_df.shape
    sim_output_list = []

    # Getting the outputs for 0 time
    initial_output = [0.0] + twin_runtime.twin_get_outputs() ### API CALL
    sim_output_list.append(initial_output)

    # Iterates over all datapoints in the dataframe
    for data_index in range(data_dimensions[0] - 1):

        # Gets the stop time of the current simulation step
        time_end = input_df.iloc[data_index + 1][0]

        # Sets the input values
        for column in input_df.columns[1::]:
            input_value = input_df[column][data_index]
            twin_runtime.twin_set_input_by_name(column, input_value) ### API CALL

        if print_step_output is True:
            inputs = input_df.iloc[data_index][1:].values.tolist()
            print("Simulating to: {} with inputs {}".format(time_end, inputs))

        # Advance simulation until the next timestep
        twin_runtime.twin_simulate(time_end) ### API CALL

        # Reads and stores the simulation results for the current timestep
        sim_output = [time_end] + twin_runtime.twin_get_outputs()  ### API CALL
        sim_output_list.append(sim_output)

        if print_step_output is True:
            twin_runtime.print_outputs() ### API CALL
            print()

    # Returns a dataframe with the simulation results for all timesteps
    output_names.insert(0, 'Time')
    return pd.DataFrame(sim_output_list, columns=output_names, dtype=float)


def run_simulation_batch_mode_csv(twin_runtime):
    # Running batch mode with csv files
    twin_runtime_batch_input = os.path.join(CUR_DIR, 'RollsRoyce_input.csv')
    twin_runtime_batch_result = os.path.join(CUR_DIR, 'RollsRoyce_batch_mode_output.csv')
    step_size = 0
    interpolate = 0

    twin_runtime.twin_simulate_batch_mode_csv(twin_runtime_batch_input, twin_runtime_batch_result, step_size,
                                              interpolate)  ### API CALL
    batch_csv_result_df = pd.read_csv(twin_runtime_batch_result)
    return batch_csv_result_df


def run_simulation_batch_mode_2d_array(twin_model_input_df, twin_runtime):
    # Running batch mode with pandas Dataframes
    step_size = 0
    interpolate = 0
    output_names = twin_runtime.twin_get_output_names()
    output_names = ['Time'] + list(output_names)
    batch_2d_array_result_df = twin_runtime.twin_simulate_batch_mode(twin_model_input_df,
                                                                     output_names, step_size,
                                                                     interpolate)  ### API CALL
    return batch_2d_array_result_df


def plot_result_comparison(runtime_result_df, twin_builder_result_df, batch_csv_result_df, batch_2d_array_result_df):
    print("Creating plot...")
    n_traces = runtime_result_df.shape[1]-1
    if twin_builder_result_df is not None:
        ncols = 4
    else:
        ncols = 3
    fig, ax = plt.subplots(ncols=ncols, nrows=n_traces, figsize=(15, 3*(n_traces)))
    fig.subplots_adjust(hspace=0.5)
    fig.set_tight_layout({"pad": .0})

    column_names = runtime_result_df.columns

    print("Plotting simulation data...")

    # Plot runtime results
    colors = ['r', 'b', 'g', 'y', 'c', 'm', 'k']
    print('{} traces to be plotted'.format(n_traces))
    for trace in range(n_traces):
        print('Plotting trace {}'.format(trace))

        if n_traces > 1:
            plot1 = ax[trace, 0]
            plot2 = ax[trace, 1]
            plot3 = ax[trace, 2]
            plot4 = ax[trace, 3]
        else:
            plot1 = ax[0]
            plot2 = ax[1]
            plot3 = ax[2]
            plot4 = ax[3]

        runtime_result_df.plot(x=0, y=column_names[trace+1], ax=plot1, ls="--", color=colors[trace%len(colors)], legend=column_names[trace+1])
        plot1.set_xlabel('Time')
        plot1.legend(bbox_to_anchor=(0, 1.02, 1, 0.2), loc="lower left")
        
        batch_csv_result_df.plot(x=0, y=column_names[trace+1], ax=plot2, color=colors[trace%len(colors)], legend=column_names[trace+1])
        plot2.set_xlabel('Time')
        plot2.legend(bbox_to_anchor=(0, 1.02, 1, 0.2), loc="lower left")

        batch_2d_array_result_df.plot(x=0, y=column_names[trace+1], ax=plot3, legend=column_names[trace+1])
        plot3.set_xlabel('Time')
        plot3.legend(bbox_to_anchor=(0, 1.02, 1, 0.2), loc="lower left")

        if twin_builder_result_df is not None:
            twin_builder_result_df.plot(x=0, y=column_names[trace + 1], ax=plot4, legend=column_names[trace + 1])
            plot4.set_xlabel('Time')
            plot4.legend(bbox_to_anchor=(0, 1.02, 1, 0.2), loc="lower left")

    if n_traces > 1:
        ax[0, 0].set_title('Step by Step simulation')
        ax[0, 1].set_title('Batch mode CSV')
        ax[0, 2].set_title('Batch mode 2D array')
        if twin_builder_result_df is not None:
            ax[0, 3].set_title('Twin Builder reference')
    else:
        ax[0].set_title('Step by Step simulation')
        ax[1].set_title('Batch mode CSV')
        ax[2].set_title('Batch mode 2D array')
        if twin_builder_result_df is not None:
            ax[3].set_title('Twin Builder reference')

    print("Setting seaborn style...")
    plt.style.use('seaborn')

    plt.show()
    print("Plotting complete!!")
    fig.savefig('result.png')


def run():
    def set_start_values(input_df):
        for name in twin_runtime.twin_get_input_names():
            value = input_df[name][0]
            twin_runtime.twin_set_input_by_name(name, value)

    # Input generated from Twin builder
    twin_builder_input = os.path.join(CUR_DIR, 'Kongsberg_input.csv')

    # Simulation results exported from Twin Builder and generated based on input
    #twin_builder_result = os.path.join(CUR_DIR, 'Kongsberg_batch_mode_output.csv')
    twin_builder_result = os.path.join(CUR_DIR, 'RollsRoyce_TwinBuilder_reference.csv')
    #twin_builder_result = None

    twin_model_file = os.path.join(CUR_DIR, 'Kongsberg_04042019.twin')
    runtime_log = os.path.join(CUR_DIR, 'KongsbergDTW_04042019.log')
    print('Loading model: {}'.format(twin_model_file))

    # Load input and reference data
    twin_model_input_df, twin_builder_result_df = load_data(twin_builder_input, twin_builder_result)

    # Instantiate Twin Runtime
    twin_runtime = TwinRuntime(twin_model_file, runtime_log, log_level=LogLevel.TWIN_LOG_ERROR) ### API CALL
    twin_runtime.print_model_info(max_var_to_print=10) ### API CALL

    twin_runtime.twin_instantiate()
    set_start_values(twin_model_input_df)
    twin_runtime.twin_initialize() ### API CALL

    # Simulate using all data points from the data frame, one datapoint at a time
    # print('Running step-by-step...')
    # runtime_result_df = run_simulation_step_by_step(twin_runtime, twin_model_input_df, print_step_output=False)

    # # Resetting Twin Runtime simulation to instantiation state
    # twin_runtime.twin_close()
    # twin_runtime.twin_load(log_level=LogLevel.TWIN_LOG_ERROR)  ### API CALL
    # twin_runtime.twin_instantiate()
    # set_start_values(twin_model_input_df)
    # twin_runtime.twin_initialize()  ### API CALL

    print('Running batch mode CSV...')
    batch_csv_result_df = run_simulation_batch_mode_csv(twin_runtime)

    # # Resetting Twin Runtime simulation to instantiation state
    # twin_runtime.twin_close()
    # twin_runtime.twin_load(log_level=LogLevel.TWIN_LOG_ERROR)  ### API CALL
    # twin_runtime.twin_instantiate()
    # set_start_values(twin_model_input_df)
    # twin_runtime.twin_initialize()  ### API CALL

    # print('Running batch mode 2d array...')
    # batch_2d_array_result_df = run_simulation_batch_mode_2d_array(twin_model_input_df, twin_runtime)

    # Plotting all the results
    #plot_result_comparison(runtime_result_df, twin_builder_result_df, batch_csv_result_df, batch_2d_array_result_df)

    # Closing the TWIN model
    twin_runtime.twin_close()


if __name__ == '__main__':
    run()
