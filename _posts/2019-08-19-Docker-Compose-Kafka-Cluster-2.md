---
layout: post
title:  Kafka Cluster with Docker Compose
categories: [docker, docker-compose, kafka]
fullview: false
---
We introduce to run and test kafka cluster in local in the [first part of the Kafka Cluster series](https://muzir.github.io/http://muzir.github.io/spring/docker/docker-compose/kafka/2019/08/19/Spring-Boot-Kafka-Cluster-1.html){:target="_blank"}. In this post we will take a bit closer to 
how to use this Kafka Cluster as a middleware between different applications. Basically we will have a project which produce a message and in another project consume these messages and
persist to database.

# Introduction

Currently we have two projects as consumer and producer. These two projects communicating via Kafka. Producer produce productChange message and publish it to ```Product.change``` topic.
Consumer listen same topic check with product name as the product saved before if it is not then save it to ```product``` table. In current configuration we have one producer and 3 consumers.
When we will create ```Product.change``` topic, we will create it with ```--replication-factor``` 3 and ```--partitions``` as 3. So the topic will be replicated in 3 kafka brokers. And in each broker
it will has 3 partitions.
 
# Configuration 

In this post we have 3 ```docker-compose.yaml``` files. One of them for kafka cluster, another one is for producer and last one for consumer. Kafka cluster ```docker-compose.yaml``` is same with the previous post so if you 
want to check it in detail check the previous post in the [first part of the Kafka Cluster series](https://muzir.github.io/http://muzir.github.io/spring/docker/docker-compose/kafka/2019/08/19/Spring-Boot-Kafka-Cluster-1.html){:target="_blank"}.
Also consumer project is using a postgres database if you want to check it configuration in detail, you can check [configure postgres section in spring boot docker post.](https://muzir.github.io/spring/docker/docker-compose/postgres/2019/03/24/Spring-Boot-Docker.html#configurePostgres){:target="_blank"}



# Result


You can find the all project [on Github](https://github.com/muzir/softwareLabs/tree/master/spring-boot-kafka-cluster){:target="_blank"}

# References


Happy coding :) 
