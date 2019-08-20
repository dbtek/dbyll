---
layout: post
title: Spring Test - Integration Testing with TestRestTemplate  
categories: [spring, testing]
fullview: false
---

Spring Test provides have few options to test our controllers. So in this post let's take a look to how to test controllers with 
```TestRestTemplate```. These tests are run as an integration tests. In that kind of tests are no difference what are 
our application doing on production(ignoring other system components proxy servers, load-balancing etc.).
These kind of tests are suitable to test any ```HTTP``` related problems. You also have more argument when some of your 
client/friend come to your table and blame you that your endpoints are not working. 

### Introduction to TestRestTemplate


```TestRestTemplate``` helps us to send http request in our integration tests. To do that need all application context
should be running. Also Spring run a local server in a random port ```@LocalServerPort```. So just need to create the request in integration tests and 
send it like a clients of your servers. ```TestRestTemplate``` have all necessary methods to send the request to server 
with a convenient way similar to [RestTemplate](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/client/RestTemplate.html){:target="_blank"}.

### Configuration

Just need to add ```testCompile("org.springframework.boot:spring-boot-starter-test")``` to our gradle file. Because this is an integration test
so Spring will run all application context. Because of that ```@SpringBootTest``` annotation should be added at the beginning of test class.  
 

```java

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class HttpRequestTest {
	private static final Long productId = 1L;
	@LocalServerPort private int port;

	@Autowired private TestRestTemplate restTemplate;

	@Test
	public void returnProductWithHttpStatusCode200_ifProductIsExist() {
		//To be provided
	}
}

```



### How to write a test with ```TestRestTemplate```

Sample current application have two endpoints. GET ```/v1/product/{productId}``` to get the product data with productId and POST ```/v1/product``` create the product. 

```java

        @Test
	public void returnProductWithHttpStatusCode200_ifProductIsExist() {
		String productName = "Product-" + productId;
		IProductPort.ProductRequest productRequest =
				new IProductPort.ProductRequest().setId(productId).setName(productName);

		restTemplate.postForObject("http://localhost:" + port + "/v1/product", productRequest, String.class);

		assertThat(restTemplate.getForObject("http://localhost:" + port + "/v1/product/" + productId, String.class))
				.contains(productId.toString())
				.contains(productName);
	}

```

So first sent a POST request to create a product. Then sent a GET request to get the product data and check that actual 
and expected responses are same or not.

### Notes

Because  ```@SpringBootTest``` needs all application contexts, these tests spend more time than unit tests. It can cause some 
delay to your build pipeline, they should be configure wisely. Also it is a good practice to configure it with a different profile.
 

### Result

So Spring starts the server and make the tests as much as close to production environment.

You can find the all project [on Github](https://github.com/muzir/softwareLabs/tree/master/spring-boot-integration-test){:target="_blank"}


### References

[https://spring.io/guides/gs/testing-web/](https://spring.io/guides/gs/testing-web/){:target="_blank"}

Happy coding :) 

