/*
    faultDetecter.cpp - Version 1.0
    Written by Paal Arthur Schjelderup Thorseth - 28.06.2019


 */

#include "faultDetecter.h"


int getDeviation(int input, int measurement){
    return abs(measurement - input);
}


void measurementListener(int const PIN){
    //TODO decide how to define handling when sensors are at place
}