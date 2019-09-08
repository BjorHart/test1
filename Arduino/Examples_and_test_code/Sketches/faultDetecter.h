/*
    faultDetecter.h - Version 1.0
    Written by Paal Arthur Schjelderup Thorseth - 28.06.2019


 */

#ifndef FAULTDETECTER_H_
#define FAULTDETECTER_H_

#include <cstdlib>

// Returns deviation in input and measurement values, in absolute value
int getDeviation(int input, int measurement);

// Listens to measurement and alerts if measurement exceeds the given tolerance
void measurementListener(int const PIN);

#endif // FAULTDETECTER_H_