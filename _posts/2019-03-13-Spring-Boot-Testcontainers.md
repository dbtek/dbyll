---
layout: post
title: Spring Test - Integration Testing with TestRestTemplate  
categories: [Spring, Testing]
fullview: false
---

Spring Boot makes it easy to setup and start a microservice project. But in microservice’s world, it is hard to test changes in all architecture.
Because it is so hard to maintain all these changes locally. So each service should responsible their own changes and guarantee that
it won't break any RPC call or business logic  with new changes. Integration tests help in that manner to release the changes in more confident.
So it is important to create an environment which is as much as close to production.    
    
Before testcontainers we have embedded or in memory solutions for databases, message queues, etc. Testcontainers are different from in memory solutions, 
because we have ability to run tests as much as close to production environment. On the other hand nowadays the services are running in containers.
So it is a great ability to run the tests with containers too.
  
Assume a web application are using Postgres database. Developer want to test new feature which save some data to some tables
and the query it from some others. Before testcontainers to test the changes with integration tests developer should configure the postgres in her local machine. Ideal case it 
should be configures in continues integration(CI) environment too. Another approach may use the in memery solutions but in that case
tests will be running different environment that production. Another problem is keeping the local database performance and isolation. Also it takes a lot of time to setup and maintenance. 
Testcontainers are solve all these problems.

### Introduction to Testcontainers

Testcontainers have the same idea that what docker containers have today.  

### Configuration  
 

```java


```



### How to write a test with ```TestRestTemplate```
 

```java

   

```


### Notes

 

### Result


You can find the all project [on Github](https://github.com/muzir/softwareLabs/tree/master/spring-boot-testcontainers)


### References


Happy coding :) 

