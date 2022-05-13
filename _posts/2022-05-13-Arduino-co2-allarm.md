---
layout: post
title: Arduino co2 project.
categories: [programming, tutorial]
tags: [arduino, programming]
description: One of my arduino projects.
fullview: false
comments: true
---

I have something new on this website.
I have an Arduino myself and make projects with it. This is one of my projects.
I used an arduino uno with a co2 sensor, rgb led and a buzzer. 
I took a simple script from the internet that reads the value of the co2 sensor. I put an if statement in between. 
That if statement makes the buzzer and the led go off when the co2 sensor gives a value higher than 400 (400 works fine for me, if you find it too sensitive or not sensitive enough you can change the value). 


Code
{% highlight c# %}
int sensorValue;
int digitalValue;
void setup()
{

Serial.begin(9600); 
pinMode(13, OUTPUT);
pinMode(12, OUTPUT);
pinMode( 3, INPUT);

}


void loop()

{

sensorValue = analogRead(0); 

digitalValue = digitalRead(2); 
if(sensorValue>400)
{
digitalWrite(13, HIGH);
digitalWrite(12, HIGH);
delay(500);
digitalWrite(12, LOW);
delay(500);


}
else
digitalWrite(13, LOW);
digitalWrite(12, LOW);


Serial.println(sensorValue, DEC); 
Serial.println(digitalValue, DEC);

delay(10); 

}
{% endhighlight %}

I hope you find it interesting. And if you try it yourself, I hope you succeed.
The end result down below. 
"![image](https://user-images.githubusercontent.com/82642042/168333785-caccb694-d729-418c-b6be-f788ad0b43fb.png)"width="100">
"![image](https://user-images.githubusercontent.com/82642042/168333860-539c851b-289b-4b91-a036-1e9bedc28395.png)"width="100">
