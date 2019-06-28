/*
    potAngleReader
    Written by Paal Arthur Schjelderup Thorseth - 28.06.2019

    Reads analog pin set by potPin and maps the current reading to angle. The angle 
    mapping is set by minAngle and maxAngle.

    Potentiometer:
    https://www.kjell.com/no/produkter/elektro-og-verktoy/utviklerkit/arduino/moduler/luxorparts-potensiometermodul-for-arduino-p90470
    
 */


int const maxAngle = 180;
int const minAngle = 0;
int const potPin = A0; // pin to be read from
int sensorValue;
int angle;

void setup() {
    Serial.begin(9600); // initialize serial communication at 9600 bps
}

void loop() {
    sensorValue = analogRead(potPin); // read input from potPin
    Serial.print("sensorValue: "); Serial.println(sensorValue);
    
    angle = map(sensorValue, 0, 1023, minAngle, maxAngle); // convert sensorValue to angle
    Serial.print("angle: "); Serial.println(angle);

    delay(1000);
}