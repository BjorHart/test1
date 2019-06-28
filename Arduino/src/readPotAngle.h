/*
    readPotAngle.cpp - Version 1.0
    Written by Paal Arthur Schjelderup Thorseth - 28.06.2019

    Reads analog pin set by potPin and maps the current reading to angle. The angle 
    mapping is set by minAngle and maxAngle.

    Potentiometer:
    https://www.kjell.com/no/produkter/elektro-og-verktoy/utviklerkit/arduino/moduler/luxorparts-potensiometermodul-for-arduino-p90470
    
 */

#ifndef READPOTANGLE_H_
#define READPOTANGLE_H_

#include <Arduino.h>

int readPotAngle();

#endif // READPOTANGLE_H_