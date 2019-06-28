/*



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