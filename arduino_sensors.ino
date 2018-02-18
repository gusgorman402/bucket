int sensor_pin = A3;
int output_value;
int photocellPin = A1;
int photocellReading;
dht DHT;

void setup(){
 
  Serial.begin(9600);
  delay(1000);
}

void loop(){
  //Start of Program 

    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& root = jsonBuffer.createObject();
    
    DHT.read11(DHT_PIN);

    output_value= analogRead(sensor_pin);
    output_value = map(output_value,550,0,0,100);

    root["temperature"] = DHT.temperature * 1.8 + 32;
    root["humidity"] = DHT.humidity;
    root["moisture"] = output_value;
    root["lightIntensity"] = analogRead(photocellPin);

    root.printTo(Serial);
    Serial.println();
    
    delay(15000);
 
}
