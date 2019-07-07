---
layout: post
title:  Spring Boot KafkaTestContainer
categories: [spring, docker, docker-compose, kafka]
fullview: false
---
In event based architecture integration test is hard. Because of event based architecture is asynchronous, it is hard to test that events 
are sent and handled by consumers. Another problem is, need to run Kafka when application started for testing. In some mocking/embedded solutions are
restrict the Kafka's features so it is not flexible to write tests with these mocking/embedded solutions. 

# Introduction

Testcontainers help us to solve above issues. It provides to run kafka inside the container when application is start in test mode.

    
# Configuration  

We will use the same project which explained in detail at [Spring Boot Kafka post](https://muzir.github.io/spring/docker/docker-compose/postgres/2019/05/25/Spring-Boot-Kafka.html#springBootKafkaConfiguration). Please refer previous link for all configuration details.

## Kafka configuration
Because we need to run kafka in test mode we need to start ```KafkaContainer``` in ```IntegrationTestConfiguration.java```. Then we will use this kafka container to create our producerProps and consumerProps 
which are using to create kafkaConsumerFactory and kafkaProducerFactory. Please check below code which is in ```IntegrationTestConfiguration```.

```java
@Configuration
@Slf4j
public class IntegrationTestConfiguration {
	
	//Postgres configuration is deleted from here. For full configuration please refer #Configoration section.

	@Bean(initMethod = "start")
	public KafkaContainer kafka() {
		return new KafkaContainer();
	}

	@Bean
	public Map<String, Object> producerProps(KafkaContainer kafkaContainer) {
		Map<String, Object> props = new ConcurrentHashMap<>();
		log.info("Kafka hashCode {}", kafkaContainer.hashCode());
		props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaContainer.getBootstrapServers());
		props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
		props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
		props.put(ProducerConfig.ACKS_CONFIG, "all");
		props.put(ProducerConfig.LINGER_MS_CONFIG, 1);
		props.put(ProducerConfig.BUFFER_MEMORY_CONFIG, 33554432);
		return props;
	}

	@Bean
	public Map<String, Object> consumerProps(KafkaContainer kafkaContainer) {
		Map<String, Object> props = new ConcurrentHashMap<>();
		log.info("Kafka hashCode {}", kafkaContainer.hashCode());
		props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaContainer.getBootstrapServers());
		props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
		props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
		props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false");
		props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "latest");
		return props;
	}

	@Bean
	public KafkaConsumerFactory<String, String> kafkaConsumerFactory() {
		return new KafkaConsumerFactory<>(consumerProps(kafka()));
	}

	@Bean
	public KafkaProducerFactory<String, String> kafkaProducerFactory() {
		return new KafkaProducerFactory<>(producerProps(kafka()));
	}
}

```


## Configure spring boot service 

In this project we want to test product save and update. In ```ProductProducer``` we sent an ```ProductChange``` event, if product is in this event does not exist in product table, then we save it as a new product. If product is exist
we update the product price. So we have two different test scenarios as ```saveProduct_ifProductChangeEventSent_andProductNotExist``` and ```updateProduct_ifProductChangeEventSent```.

```java
@RunWith(SpringRunner.class)
@Slf4j
public class ProductKafkaIntegrationTest extends BaseIntegrationTest {

	@Autowired
	ProductProducer productProducer;
	@Autowired
	ProductService productService;

	@Test
	public void updateProduct_ifProductChangeEventSent() throws JsonProcessingException {
		/*
		 save new product to product table which name is product1
		 */
		String productName = "product1";
		BigDecimal price = new BigDecimal("22.25");
		Product product = new PersistantProduct(null, productName, price);
		productService.saveProduct(product);

		//Sent price change event
		BigDecimal newPrice = new BigDecimal("20.00");
		Product productChange = new ProductChange(productName, newPrice);
		productProducer.publishProductChange(productChange);

		//Product should be updated with new price
		Product updatedProductParam = new PersistantProduct(productName);
		Optional<Product> updatedProduct = retryUntil(
				() -> productService.getProduct(updatedProductParam),
				l -> l.get().price().equals(newPrice));
		Assert.assertEquals(productName, updatedProduct.get().name());
	}

	@Test
	public void saveProduct_ifProductChangeEventSent_andProductNotExist() throws JsonProcessingException {
		String productName = "product2";
		BigDecimal price = new BigDecimal("20.00");
		//Sent price change event
		Product productChange = new ProductChange(productName, price);
		productProducer.publishProductChange(productChange);

		//Check product is saved
		Product paramSavedProduct = new PersistantProduct(productName);
		Optional<Product> savedProduct = retryUntil(
				() -> productService.getProduct(paramSavedProduct),
				Optional::isPresent);
		Assert.assertEquals(productName, savedProduct.get().name());
		Assert.assertEquals(price, savedProduct.get().price());
	}

	private <T> T retryUntil(Callable<T> callable, Predicate<T> predicate) {
		return retryUntil(callable, predicate, Duration.ofSeconds(10L), Duration.ofMillis(100L));
	}

	private <T> T retryUntil(Callable<T> callable, Predicate<T> predicate, Duration maxDuration, Duration checkInterval) {
		Instant start = Instant.now();
		Instant endTime = start.plus(maxDuration);

		T result;
		do {
			result = TestUtil.callUnchecked(callable);
			if (predicate.test(result)) {
				break;
			}

			try {
				Thread.sleep(checkInterval.toMillis());
			} catch (InterruptedException e) {
			}
		} while (Instant.now().isBefore(endTime));

		return result;
	}
}

```

After sent the event messages to kafka, then ```retryUntil``` method check that provided predicate is matched in 10 seconds. If it is then tests are passed. 

# How to run the project

It is easy to run the project just with ```./cleanRun.sh```

# Result

You can find the all project [on Github](https://github.com/muzir/softwareLabs/tree/master/spring-boot-kafka)

# References

https://www.testcontainers.org/modules/kafka/
https://www.confluent.io/blog/apache-kafka-spring-boot-application

Happy coding :) 
