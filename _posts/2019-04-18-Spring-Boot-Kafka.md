---
layout: post
title:  Spring Boot Kafka
categories: [spring, docker, docker-compose, kafka]
fullview: false
---

Apache Kafka is distributed messaging system which is initially developed by Jay Kreps when he was working in Linkedin.
Apache Kafka designed as a distributed system which helps to scale horizontal easily. It provides high throughput and low
latency writing performance. It is using in few different use cases as data pipeline between different
systems/microservices, storage or powering logging/monitoring for the high traffic application. In this blogpost, create a project which simulate a basic product data pipeline of a e-commerce site.

This blogpost assume that you are familiar basic Apache Kafka terminology. Also basically you should know what are topics, partitions, offsets, consumers, producers in Apache Kafka.

## Introduction

Apache Kafka will be using as data hub between data producer and data consumer. This will provide systems high coherence and
low dependency to other systems. One part of the system is just create a message and publish it to Kafka under a specific topic name, if any other system require that message then just need to subscribe that topic
and read the messages from Kafka. This also helps to build an event driven asynchronous architecture.

In this blogpost to simulate a basic product data pipeline, one part of the system publish message under ```Product.change``` topic. One of the other part of the system subscribe that topics
and consume that messages. If product is not exist in product table then save it as a new product, if it is exist just update the price change.    

## Configuration  

Apache Kafka working as a Publish/Subscribe messaging platform. One of the difference from other messaging platforms that Kafka is not directly send messages to specific receivers. 
So Kafka provides messages and subscribers consume it independently from publishers. These publish/subscribe pattern is implemented by consumers and producers in Kafka. 

```java

        @Configuration
        @Profile("!integration")
        @Slf4j
        public class KafkaConfiguration {
        
        	private final Map<String, Object> producerProps;
        	private final Map<String, Object> consumerProps;
        
        	@Autowired
        	public KafkaConfiguration(@Value("${kafka.bootstrap.servers}") String bootstrapServers) {
        		this.producerProps = producerProps(bootstrapServers);
        		this.consumerProps = consumerProps(bootstrapServers);
        	}
        
        	private Map<String, Object> producerProps(String bootstrapServers
        	) {
        		final Map<String, Object> props = new ConcurrentHashMap<>();
        		props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        		props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
        		props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
        		props.put(ProducerConfig.ACKS_CONFIG, "all");
        		props.put(ProducerConfig.LINGER_MS_CONFIG, 1);
        		props.put(ProducerConfig.BUFFER_MEMORY_CONFIG, 33554432);
        		return props;
        	}
        
        	private Map<String, Object> consumerProps(
        			String bootstrapServers) {
        
        		final Map<String, Object> props = new ConcurrentHashMap<>();
        		props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        		props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer");
        		props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer");
        		props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false");
        		props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        		props.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 50);
        		return props;
        	}
        
        	@Bean
        	public KafkaConsumerFactory<String, String> kafkaConsumerFactory() {
        		return new KafkaConsumerFactory<>(consumerProps);
        	}
        
        	@Bean
        	public KafkaProducerFactory<String, String> kafkaProducerFactory() {
        		return new KafkaProducerFactory<>(producerProps);
        	}
        }

```

In above configuration class definition at ```KafkaConfiguration.java``` defined producer properties, consumer properties, kafkaConsumerFactory, kafkaProducerFactory. So factory 
beans are defined at ```KafkaConfiguration.java```, we can create independent consumers and producers with help of these factory classes.

For consumers and producers properties; these are mostly mandatory fields to set.  

####Producer Properties

###### ProducerConfig.BOOTSTRAP_SERVERS_CONFIG
It is the address of the broker. In a kafka cluster this field has more than one value which are seperated via comma. In our example we are running one Kafka broker, which is not a good example in real world kafka application,
where address is coming from ```kafka.bootstrap.servers``` environment variable which is set in ```docker-compose.yml``` as an environment variable.

###### ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG
Every record(message) sent to Kafka has a key and value, and before send the record to Kafka we need to serialize that key information, Kafka is hold the data as
byte arrays. So this configuration define the serializer class for key. 

###### VALUE_SERIALIZER_CLASS_CONFIG
So this configuration define the serializer class for value.

###### ProducerConfig.ACKS_CONFIG
When producer send message to broker, it will also get an acknowledge message from broker when message arrived. In cluster environment Kafka may have few different
brokers. So this parameter define when an acknowledge should be send to producer. Potentially this variable have 3 values, if it is 0 then producer
doesn't get any acknowledge about message arriving to brokers. If it is set to 1 then producer will get an acknowledge when message arrive to leader broker.
If it is set it as "all", then producer will get an acknowledge when all brokers got the same message. 

###### LINGER_MS_CONFIG
This parameter controls the amount of time wait for additional messages before sending the current batch. Producer sends a batch of messages either
when the current batch is full or when the linger.ms limit is reached. So if this parameter set it as higher value it will increase the latency
but at the same time it will increase the throughput because we are sending more messages in a batch.

###### ProducerConfig.BUFFER_MEMORY_CONFIG
This parameter controls the total memory the producer will use.

####Consumer Properties

##### ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG
It is the address of the broker. In a kafka cluster this field has more than one value which are seperated via comma.

##### ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG
Kafka hold the data as byte array so when reading the message key from Kafka we need to deserialize it to an object. This property
set which class should be used for that conversion, it is also dependent how is it serialized in producer KEY_SERIALIZER_CLASS_CONFIG.

##### ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG
Kafka hold the data as byte array so when reading the message value from Kafka we need to deserialize it to an object. This property
set which class should be used for that conversion, it is also dependent how is it serialized in producer VALUE_SERIALIZER_CLASS_CONFIG.

##### ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG
This property determine consumer commit strategy. If it is true, consumer will commit periodically after fetch the records from brokers.
By default it is 5 seconds. If it is false, commit should be done by developer after processing the records. It can be commit after from each 
record processing or after finish a bunch of records in a synchronous/asynchronous way. 

##### ConsumerConfig.AUTO_OFFSET_RESET_CONFIG
When we add a new consumer or remove a consumer from consumer group which listen a topic, we need to rebalance the topic's partitions in that consumer group.
If we are adding a new consumer after rebalancing is done, new conusmer starts to consume messages from partitions. This property
determine that it should start from latest offsets if it is set as "latest" which committed by other consumers. If it is set as
"earliest" then it needs to process all the messages in that partition.

##### ConsumerConfig.MAX_POLL_RECORDS_CONFIG
When consumer fetch records from broker it reads the records in a batch. This property determine how many records can be read maximum in one fetch request.

### Docker Configuration

#### Postgres configuration

For postgres configuration read [configure postgres section in spring boot docker post.](https://muzir.github.io/spring/docker/docker-compose/postgres/2019/03/24/Spring-Boot-Docker.html#configurePostgres), same 
configuration is using in this project too.

#### Kafka configuration

In below configuration defined 4 different services as zookeeper, kafka, postgres and spring-boot-kafka. ```zookeeper``` is using for kafka dependency.
```kafka``` service define host name and port. One of the important configuration is ```spring-boot-kafka``` service ```kafka.bootstrap.servers``` environment.
ProducerConfig.BOOTSTRAP_SERVERS_CONFIG and ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG set via that environment variable.

```yaml
version: "3.7"
services:
  zookeeper:
    image: "zookeeper:3.4.13"
    hostname: zookeeper
    ports:
      - "2181:2181"
  kafka:
    image: "confluent/kafka:latest"
    ports:
      - "9092:9092"
    hostname: kafka
    links:
      - zookeeper
    environment:
      KAFKA_ADVERTISED_HOST_NAME: kafka
      KAFKA_ADVERTISED_PORT: 9092
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
  postgres:
    build: postgres
    environment:
      POSTGRES_USER: dbuser
      POSTGRES_PASSWORD: password
      POSTGRES_DB: store
    ports:
    - 5432:5432
  spring-boot-kafka:
    build: ../
    ports:
      - "12345:12345"
    links:
      - postgres
      - kafka
    environment:
      SPRING_PROFILES_ACTIVE: dev
      JAVA_HEAP_SIZE_MB: 1024
      kafka.bootstrap.servers: kafka:9092
```


### Configure spring boot service 


### How to run the project

### Notes

### Result

You can find the all project [on Github](https://github.com/muzir/softwareLabs/tree/master/spring-boot-kafka)

### References

https://www.confluent.io/blog/apache-kafka-spring-boot-application

Happy coding :) 
