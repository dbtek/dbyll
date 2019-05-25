---
layout: post
title:  Spring Boot Kafka
categories: [spring, docker, docker-compose, kafka]
fullview: false
---

Apache Kafka is a distributed messaging system which is initially developed by Jay Kreps when he was working in Linkedin.
Apache Kafka designed as a distributed system which helps to scale horizontally. It is using in few different use cases as data pipeline between different
systems/microservices, storage or powering logging/monitoring for the high traffic application. In this blogpost, project simulates a basic product data pipeline of e-commerce site.

# Introduction

Apache Kafka will be using as data hub between data producer and data consumer. This will help systems can be developed with high coherence and
low coupling. One part of the system is just create a message and publish it to Kafka under a specific topic name, if any other system require that message then just need to subscribe that topic
and read the messages from Kafka. So in that way services doesn't have to wait to each other, they can work in asynchronous way.
It means Kafka helps to build an event driven asynchronous architecture.

In this blogpost one part of the system publish message under ```Product.change``` topic. One of the other part of the system subscribe that topics
and consume these messages. If product doesn't exist in product table then save it as a new product. If it is exist just update the price change.    

# Configuration  

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
        		props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, 
        		"org.apache.kafka.common.serialization.StringSerializer");
        		props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, 
        		"org.apache.kafka.common.serialization.StringSerializer");
        		props.put(ProducerConfig.ACKS_CONFIG, "all");
        		props.put(ProducerConfig.LINGER_MS_CONFIG, 1);
        		props.put(ProducerConfig.BUFFER_MEMORY_CONFIG, 33554432);
        		return props;
        	}
        
        	private Map<String, Object> consumerProps(
        			String bootstrapServers) {
        
        		final Map<String, Object> props = new ConcurrentHashMap<>();
        		props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        		props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, 
        		"org.apache.kafka.common.serialization.StringDeserializer");
        		props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, 
        		"org.apache.kafka.common.serialization.StringDeserializer");
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

In above configuration class, ```KafkaConfiguration.java``` defined producer properties, consumer properties, kafkaConsumerFactory, kafkaProducerFactory. So factory 
beans are defined at ```KafkaConfiguration.java```, independent consumers and producers can be created with help of these factory classes.

For consumers and producers properties; these are mostly mandatory fields to set.  

### Producer Properties

#### ProducerConfig.BOOTSTRAP_SERVERS_CONFIG
It is the address of the broker. In a kafka cluster this field has more than one value which are separated via comma. In our example we are running one Kafka broker, which is not a good example in real world kafka application,
where address is coming from ```kafka.bootstrap.servers``` environment variable which is set in ```docker-compose.yml``` as an environment variable.

#### ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG
Every record(message) sent to Kafka has a key and value, and before send the record to Kafka we need to serialize that key information, Kafka is hold the data as
byte arrays. So this configuration define the serializer class for key. 

#### ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG
So this configuration define the serializer class for value.

#### ProducerConfig.ACKS_CONFIG
When producer send message to broker, it will also get an acknowledge message from broker when message arrived. In cluster environment Kafka may have few different
brokers. So this parameter define when an acknowledge should be send to producer. Potentially this variable have 3 values, if it is 0 then producer
doesn't get any acknowledge about message arriving to brokers. If it is set to 1 then producer will get an acknowledge when message arrive to leader broker.
If it is set it as "all", then producer will get an acknowledge when all brokers got the same message. 

#### ProducerConfig.LINGER_MS_CONFIG
This parameter controls the amount of time wait for additional messages before sending the current batch. Producer sends a batch of messages either
when the current batch is full or when the linger.ms limit is reached. So if this parameter set it as higher value it will increase the latency
but at the same time it will increase the throughput because we are sending more messages in a batch.

#### ProducerConfig.BUFFER_MEMORY_CONFIG
This parameter controls the total memory of the producer use.

### Consumer Properties

#### ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG
It is the address of the broker. In a kafka cluster this field has more than one value which are separated via comma.

#### ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG
Kafka hold the data as byte array so when reading the message key from Kafka, it is needed to deserialize to an object. This property
set which class should be used for that conversion, it is also dependent how is it serialized in producer KEY_SERIALIZER_CLASS_CONFIG.

#### ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG
Kafka hold the data as byte array so when reading the message value from Kafka we need to deserialize it to an object. This property
set which class should be used for that conversion, it is also dependent how is it serialized in producer VALUE_SERIALIZER_CLASS_CONFIG.

#### ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG
This property determine consumer commit strategy. If it is true, consumer will commit periodically after fetch the records from brokers.
By default it is 5 seconds. If it is false, commit should be done by developer after processing the records. It can be commit after from each 
record processing or after finish a bunch of records in a synchronous/asynchronous way. 

#### ConsumerConfig.AUTO_OFFSET_RESET_CONFIG
When we add a new consumer or remove a consumer from consumer group which listen a topic, Kafka need to rebalance the topic's partitions in that consumer group.
If we are adding a new consumer after rebalancing is done, new consumer starts to consume messages from partitions. This property
determine that it should start from latest offset if it is set as "latest" which committed by other consumers. If it is set as
"earliest" then it needs to process all the messages in that partition.

#### ConsumerConfig.MAX_POLL_RECORDS_CONFIG
When consumer fetch records from broker it reads the records in a batch. This property determine how many records can be read maximum in one fetch request.

## Postgres configuration

For postgres configuration read [configure postgres section in spring boot docker post.](https://muzir.github.io/spring/docker/docker-compose/postgres/2019/03/24/Spring-Boot-Docker.html#configurePostgres), same 
configuration is using in this project too.

## Kafka configuration

In below configuration defined 4 different services as zookeeper, kafka, postgres and spring-boot-kafka. ```zookeeper``` is using for kafka dependency.
```kafka``` service define host name and port. One of the important configuration is ```spring-boot-kafka``` service ```kafka.bootstrap.servers``` environment variable.
```ProducerConfig.BOOTSTRAP_SERVERS_CONFIG``` and ```ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG``` set via that environment variable.

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


## Configure spring boot service 

Now Kafka, zookeeper, postgres services are ready to run. Let's take a closer to how to configure consumer and producer in our application spring-boot-kafka.

### Consumers Configurations

All consumers should implements ```EventConsumer``` interface. So this is creating a contract for all consumers.  

```java

package com.softwarelabs.kafka;

public interface EventConsumer<T> {

	void start(KafkaConsumerFactory kafkaConsumerFactory);

	void stop();

	void consume(T value);

	Class eventType();

	String topicName();

	String consumerGroupId();
}


```

In that way easily manage to start and stop consumers with below configuration class.

```java

package com.softwarelabs.product;

@Configuration
public class ConsumerConfiguration {

	private final Set<EventConsumer> consumers;
	private final KafkaConsumerFactory<String, String> kafkaConsumerFactory;

	@Autowired
	public ConsumerConfiguration(Set<EventConsumer> consumers, 
	                             KafkaConsumerFactory kafkaConsumerFactory) {
		this.consumers = consumers;
		this.kafkaConsumerFactory = kafkaConsumerFactory;
	}

	@PostConstruct
	public void start() {
		consumers.forEach(consumer -> consumer.start(kafkaConsumerFactory));
	}

	@PreDestroy
	public void stop() {
		consumers.forEach(consumer -> consumer.stop());
	}

}

```

 ```ConsumerConfiguration``` bean created all consumers after bean is created. Also this bean is responsible to stop all consumers when this bean
 is starting to destroy. In start function we are calling consumer start which will create a new ```KafkaConsumer``` with ```consumerProps```. After 
 creating the ```kafkaConsumer```, passing it to a ```KafkaConsumerThread``` and start to thread.
 
 ```java
@Service
@Slf4j
public class ProductConsumer implements EventConsumer<ProductChange> {

@Override
 	public void start(KafkaConsumerFactory kafkaConsumerFactory) {
 		productConsumerThread =
 				new KafkaConsumerThread(this, 
 				                        kafkaConsumerFactory.createConsumer(consumerGroupId()), 
 				                        new ObjectMapper());
 		productConsumerThread.start();
 	}
}
```

KafkaConsumerThread has the all KafkaConsumer related functionality inside it. Consumers poll inside ```KafkaConsumerThread```. After process the 
messages consumer commit asynchronously at the end. If something goes wrong when committing the offsets to broker then log the exception in ```onComplete```
event at ```ErrorLoggingCommitCallback``` class.


```java

package com.softwarelabs.kafka;

@Slf4j
public class KafkaConsumerThread<T, K, V> {

	private Consumer<K, V> consumer;
	private ObjectMapper mapper;
	private EventConsumer<T> eventConsumer;
	private OffsetCommitCallback errorLoggingCommitCallback() {
		return new ErrorLoggingCommitCallback();
	}

	public KafkaConsumerThread(EventConsumer<T> eventConsumer, 
	                           Consumer<K, V> consumer, 
	                           ObjectMapper mapper) {
		log.info("Starting Kafka consumer");
		this.consumer = consumer;
		this.eventConsumer = eventConsumer;
		this.consumer.subscribe(Collections.singletonList(eventConsumer.topicName()));
		this.mapper = mapper;
	}

	public void start(){
		Thread consumer = new Thread(() -> {
			run();
		});
		/*
		 * Starting the thread.
		 */
		consumer.start();
	}

	public void stop(){
		consumer.wakeup();
	}

	private void run() {
		while (true) {
			ConsumerRecords<K, V> consumerRecords = consumer.poll(Duration.ofMillis(POLLING_TIME));
			//print each record.
			consumerRecords.forEach(record -> {
				log.info("Record Key " + record.key());
				log.info("Record value " + record.value());
				log.info("Record partition " + record.partition());
				log.info("Record offset " + record.offset());
				// commits the offset of record to broker.
				T value = null;
				try {
					value = (T) mapper.readValue((String) record.value(), 
					                             eventConsumer.eventType());
				} catch (IOException e) {
					e.printStackTrace();
				}
				eventConsumer.consume(value);
			});
			consumer.commitAsync(errorLoggingCommitCallback());
		}
	}

	private class ErrorLoggingCommitCallback implements OffsetCommitCallback {

		@Override
		public void onComplete(Map<TopicPartition, 
		                       OffsetAndMetadata> offsets, 
		                       Exception exception) {
			if (exception != null) {
				log.error("Exception while commiting offsets to Kafka", exception);
			}
		}
	}
}

```


### Producers Configuration

All producers should implements ```EventProducer``` interface. So this is creating a contract for all producers.

```java

package com.softwarelabs.kafka;

public interface EventProducer<T> {
	void publish(T value);

	String topicName();

	String producerClientId();
}


```

In ```ProductProducer``` converting java object to string json and send it to ```publish``` method which will asynchronously send a record to a topic in kafka broker.

```java
@Slf4j
@Service
public class ProductProducer implements EventProducer<String> {
    public void publishProductChange(Product product) throws JsonProcessingException {
            ProductChange productChange = new ProductChange(product.name(), product.price());
            String productChangeMessage = mapper.writeValueAsString(productChange);
            publish(productChangeMessage);
        }
    
        @Override
        public void publish(String message) {
            ProducerRecord<String, String> record = new ProducerRecord<>(topicName(), "1", message);
            log.info("Publish topic : {} message : {}", topicName(), message);
            kafkaProducer.send(record, produceCallback);
        }
}
```

Besides all these configuration, ```ProductProducerSchedular``` has a scheduler which trigger message publish with the help of java faker library.
Creating a ```ProductChange``` object and publish it to ```productProducer.publishProductChange```, so ```productConsumers``` are listening "Product.change"
topic and save the product if it is not exist at Product table, if it is exist update the changed price.

```java
@Service
@Slf4j
public class ProductConsumer implements EventConsumer<ProductChange> {
public void consume(ProductChange productChange) {
		log.info("Consume productChange name: {}  price: {}", 
		          productChange.name(), 
		          productChange.price());
		Product product = new PersistantProduct(productChange);
		productService.getProduct(product)
				.map(p -> {
					log.info("Product {} is exist", product.name());
					return productService.saveProduct(new PersistantProduct(p.id(), 
					                                  productChange.name(), 
					                                  productChange.price()));

						}
				)
				.orElseGet(() -> {
							log.info("Product {} is not exist", product.name());
							return productService.saveProduct(productChange);
						}

				);
	}
}
``` 



# How to run the project

It is easy to run the project just with ```./cleanRun.sh```

# Notes

This project should be used in development environment. But it may be used as a base of some project and can be prepare for
production usage as well.

# Result

You can find the all project [on Github](https://github.com/muzir/softwareLabs/tree/master/spring-boot-kafka)

# References

https://www.confluent.io/blog/apache-kafka-spring-boot-application

Happy coding :) 
