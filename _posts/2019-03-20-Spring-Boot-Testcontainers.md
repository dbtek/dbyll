---
layout: post
title:  Introduction to Testcontainers
categories: [Spring, Testing, Docker, Testcontainers]
fullview: false
---

Spring Boot makes it easy to setup and start a microservice project. But in microservice’s world, it is hard to test changes in all architecture.
Because it is hard to setup same environment in local. So each service should responsible their own changes and guarantee that
it won't break any RPC call or business logic  with new changes. Integration tests help in that manner to release the changes in more confident.
So it is important to create an environment which is as much as close to production.

### Introduction

Testcontainers is a java library which rely on junit and docker containers. Any external dependency may included in testcontainer if it has a
docker image.  

Before testcontainers embedded or in memory solutions are exist for databases, message queues, etc. Testcontainers are different from in memory solutions, 
because it provides the ability to run the tests as much as close to production environment. On the other hand nowadays the services are running in containers.
So it is a great ability to run the tests in docker containers too.
  
Assume a web application are using Postgres database. Developer want to test new feature which save some data to some tables
and the query it from some others. Before testcontainers, to test the changes with integration tests developer should configure the postgres in her local machine. 
Ideal case it should be configures in continues integration(CI) environment too. Another approach may use the in memery solutions but in that case
tests will be running different environment that production. Another problem is keeping the local database performance and isolation. Also it takes a lot of time to setup and maintenance. 
Testcontainers are solve all these problems.

### Configuration  

In demo project, integration tests are using Spring tests and testcontainers. To see all dependency, you may take a look to
[build.gradle](https://github.com/muzir/softwareLabs/blob/master/spring-boot-testcontainers/build.gradle) file.

```gradle

testImplementation 'org.springframework.boot:spring-boot-starter-test'
testImplementation 'org.testcontainers:postgresql:1.10.6'

```

Created a configuration class for integration tests dependency beans. ```PostgreSQLContainer``` and ```DataSource``` beans are created in
IntegrationTestConfiguration class. Also need to set the ```DataSource``` bean as ```@Primary```, because application context initialize  
a default data source and in ```IntegrationTestConfiguration``` created another one. So it should know which one is injected primarily.

```java
@Configuration
public class IntegrationTestConfiguration {

	private static final String DB_NAME = "store";
	private static final String USERNAME = "dbuser";
	private static final String PASSWORD = "password";
	private static final String PORT = "5432";
	private static final String INIT_SCRIPT_PATH="db/embedded-postgres-init.sql";



	@Bean(initMethod = "start")
	JdbcDatabaseContainer databaseContainer() {
		return new PostgreSQLContainer()
				.withInitScript(INIT_SCRIPT_PATH)
				.withUsername(USERNAME)
				.withPassword(PASSWORD)
				.withDatabaseName(DB_NAME);
	}

	@Bean
	@Primary
	DataSource dataSource(JdbcDatabaseContainer container) {

		System.out.println("Connecting to test container " + container.getUsername() + ":" + container.getPassword() + "@" + container.getJdbcUrl());

		int mappedPort = container.getMappedPort(Integer.parseInt(PORT));
		String mappedHost = container.getContainerIpAddress();

		final DataSource dataSource = DataSourceBuilder.create()
				.url("jdbc:postgresql://" + mappedHost + ":" + mappedPort + "/" + container.getDatabaseName())
				.username(container.getUsername())
				.password(container.getPassword())
				.driverClassName(container.getDriverClassName())
				.build();

		return dataSource;
	}
}
```

Another important file is ```embedded-postgres-init.sql```. It is a using to initialize the database. In our example 
there are two statements as one of them create hibernate_sequence, which is a requirement for ```AbstractPersistable```, and
another one is just creating the product table. You may also want to run some insert queries before run your tests, so in that
case need to put all statements in that file which is required by test scenarios.

```sql

CREATE SEQUENCE IF NOT EXISTS hibernate_sequence START 1;

create table if not exists product
(
  id  bigint not null constraint product_pkey primary key,
  name  varchar(255) UNIQUE
);

```

In the last step for the configuration, defined a base integration tests which is an abstract class and will be extended by 
other integration classes. It is a good practice to run your integration tests with a different profile, so below active profile
is integration, which helps to isolate your integration tests application context from other profiles like development, test or
production.

```java

package com.softwarelabs.config;

import com.softwarelabs.App;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = App.class)
@ActiveProfiles("integration")
public abstract class BaseIntegrationTest {
}


```

### How to write a test

After configure the configuration and base classes then below is a simple example, an integration junit test which is 
using testcontainers. In below scenario; just save a product via ```productRepository.save(product)``` and then query it from database 
with ```productRepository.findByName(productName)```, then check the product names.

```java

@RunWith(SpringRunner.class)
public class CrudProductServiceIntegrationTest extends BaseIntegrationTest {

	@Autowired
	private ProductRepository productRepository;

	@Test
	public void returnProductName_ifProductSavedBefore() {
		String productName = "product001";
		PersistableProduct product = new PersistableProduct(productName);
		productRepository.save(product);
		Optional<Product> actualProduct = productRepository.findByName(productName);
		Assert.assertTrue(actualProduct.isPresent());
		Assert.assertEquals(productName, actualProduct.get().name());
	}
}


```


### Notes

In this example, business logic keep it as simple, because it just focus how testcontainers is configured for integration 
tests. After configuration you may want to create more complex test scenarios with some other external storage or components too.

Also before run your tests check the docker first. Docker should be running at your machine otherwise you may see that error. 
```Caused by: java.lang.IllegalStateException: Could not find a valid Docker environment. Please see logs and check configuration```

### Result


You can find the all project [on Github](https://github.com/muzir/softwareLabs/tree/master/spring-boot-containers)


### References

https://www.testcontainers.org/


Happy coding :) 

