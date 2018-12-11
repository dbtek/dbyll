---
layout: post
title: How a Good Programmer Perform Better in a Slow Computer
categories: [algorithms]
fullview: false
---

Nowadays I am reading Thomas Colmen's book, Algorithms Unlocked. I like one example in it which demostrate that how 
good programmer perform better in a slow computer. 

Assume that we have two programmers whose names are Mark and Alan. Mark has a computer which can executes 10 billion
instructions per second. Alan's computer can executes 10 million instructors per second. They are working in same company and 
starting in the same project. They need to optimize an existing sort algorithm which is so slow when items count about 10 millions.
Actually sorting items are just some price numbers, they are representive in eight-byte integers. In memory 10 million
records take 80 megabytes. 

Two programmers start to work seperately. They agree that first they create their own solutions and test at their computers.
Then decide that which algorithms executes in better performance then it will be use to optimize the existing code. 

Mark's solution requires ![](https://latex.codecogs.com/gif.latex?2n%5E2) instructions to sort n numbers.

To sort 10 million numbers, Mark's computer takes 20 000 seconds.

![Mark's Performance](https://latex.codecogs.com/gif.latex?%5Cfrac%7B2%20%5Ctimes%20%2810%20%5E%207%29%5E2%20instructions%7D%20%7B%2810%5E10%20instructions/second%29%7D%20%3D%2020%2C%20000%20seconds)

   
which is more than 5.5 hours.

 Alan's come with a solution
taking ![](https://latex.codecogs.com/gif.latex?50n%5Clg%20n) instructions.


![](https://latex.codecogs.com/gif.latex?%5Cfrac%7B50%20%5Ctimes%2010%20%5E%207%5Clg%2010%20%5E%207%20instructions%7D%20%7B%2810%5E7%20instructions/second%29%7D%20%5Capprox%201163%20seconds) 


which is under 20 minutes. Because Alan's algorithm running time grows more slowly, even with a poor computer his 
algortihm runs 17 times faster than Mark's solution. The advantage of the algorithm even more seen when we want to sort
100 million items. 