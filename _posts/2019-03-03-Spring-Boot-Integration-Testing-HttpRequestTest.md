---
layout: post
title: Spring Test - Web Layer Testing with TestRestTemplate  
categories: [Spring, Testing]
fullview: false
---

We have few options to test our controllers. So in this post we will take a look to ```TestRestTemplate```.
These tests are run as an integration tests.In that kind of tests are no difference what are our application 
doing on production(ignoring other system components proxy servers, load-balancing etc.).These kind of tests 
are suitable to test any TCP related problems. You also have more argument when some of your client come to 
your table as your endpoints are not working. 

### Introduction to TestRestTemplate


```TestRestTemplate``` helps us to send http request in our integration tests. To do that we need all application context
should be running. Also Spring run a local server in a random port ```@LocalServerPort```. So we just need to create our request in our integration tests and 
send it like a clients of your servers. ```TestRestTemplate``` have all necessary methods to send the request to server 
with a convenient way similar to [RestTemplate](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/client/RestTemplate.html){:target="_blank"}. 
