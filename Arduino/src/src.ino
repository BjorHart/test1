/*
    src.ino
    Written by Paal Arthur Schjelderup Thorseth - 28.06.2019

    todo text here

 */

#include "readPotAngle.h"

void setup(){
    Serial.begin(9600);
}

void loop(){
    readPotAngle(A0);
    delay(1000);
}
