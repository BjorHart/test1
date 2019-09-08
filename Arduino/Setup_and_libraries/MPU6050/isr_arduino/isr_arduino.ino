

#include <EnableInterrupt.h>

int pin = A0;
int pin2 = A1;
volatile int state = LOW;


void setup()
{
  pinMode(pin, OUTPUT);
  pinMode(pin2, OUTPUT);
  digitalWrite(pin, HIGH);
  digitalWrite(pin2, HIGH);

  digitalWrite(8, HIGH);
  digitalWrite(9, HIGH);
  enableInterrupt(8,toggle,CHANGE);
  enableInterrupt(9,toggle2,CHANGE);

}

void loop()
{
  // Does Nothing
}

void toggle2()
{
 Serial.println("interrupt2");
}

// Interrupt Service Routine
void toggle()
{
  Serial.println("interrupt1");

}
