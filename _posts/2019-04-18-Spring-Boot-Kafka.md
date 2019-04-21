---
layout: post
title:  Spring Boot Kafka
categories: [spring, docker, docker-compose, kafka]
fullview: false
---

Apache Kafka is distributed messaging system which was initially developed by Jay Kreps when he was working in Linkedin.
Apache Kafka designed as a distributed system which helps to scale horizontal easily. It provides high throughput and low
latency writing performance. It is using in few diferrent use cases as data pipeline between different
systems/microservices, storage or powering logging/monitoring for the high traffic application. In this blogpost, let's create a 
demo project which simulate a basic product data pipeline of a e-commerce site.

This blogpost assume that you are familiar basic Apache Kafka terminology. Also basically you should know what are topics, partitions, offsets, consumers, producers in Apache Kafka.

### Introduction

Apache Kafka will be using as data hub between data producer and data consumer. This will provide systems high coherence and
low dependency to other systems. One part of the system is just create a message and publish it to Kafka under a specific topic name, if any other system require that message then just need to subscribe that topic
and read the messages from Kafka. This also helps to build an event driven asynchronous architecture.

In this blogpost to simulate a basic product data pipeline, one part of the system publish message under ```Product.change``` topic. One of the other part of the system subscribe that topics
and consume that messages. If product is not exist in product table then save it as a new product, if it is exist just update the price change.    

### Configuration  

Apache Kafka working as a Publish/Subscribe messaging platform. One of the difference from other messaging platforms that Kafka is not directly send messages to specific receivers. 
So Kafka provides messages and subscribers consume it independently from publishers. These publish/subscribe pattern is implemented by consumers and producers in Kafka. 

```java

        @Bean
	public Map<String, Object> consumerProps(
			@Value("${kafka.bootstrap.servers}") String bootstrapServers) {

		final Map<String, Object> props = new HashMap();
		props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
		props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer");
		props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer");
		props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false");
		props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
		props.put(ConsumerConfig.GROUP_ID_CONFIG, "consumerGroup1");
		props.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 50);
		return props;
	}

```


#### Configure spring boot service 

#### Configure Kafka

### How to run the project

### Notes

### Result

You can find the all project [on Github](https://github.com/muzir/softwareLabs/tree/master/spring-boot-kafka)

### References

https://www.confluent.io/blog/apache-kafka-spring-boot-application

Happy coding :) 
