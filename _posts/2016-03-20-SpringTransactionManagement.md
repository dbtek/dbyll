---
layout: post
title: Spring Transaction Management
categories: [Spring]
fullview: true
---

{:toc}


**[Spring Transaction Management](http://docs.spring.io/spring/docs/current/spring-framework-reference/html/transaction.html)** incelemek icin Spring Framework'un kendi dokumantasyonu baz alarak ornekler yaptim. Bu orneklere gecmeden once basitce hangi basliklar altinda inceleyecegimi belirtmek isterim.


Giris
------------

#### <i class="icon-file"></i> Global Transactions

#### <i class="icon-file"></i> Local Transactions

#### <i class="icon-file"></i> Spring Transaction Abstraction


Declarative Transaction Management
-------------

#### <i class="icon-file"></i> tx-advice usage with AspectJ

#### <i class="icon-file"></i> Example Of Declerative Transaction Implementation

Spring'de fiziksel(physical) transaction ile mantiksal(logical) transaction birbirinden ayri yapilardir. Mantiksal transaction lar fiziksel transaction icinde kurgulanir.  
Nested Propagation tag'i sadece **[DataSourceTransactionManager](http://docs.spring.io/spring-framework/docs/2.5.x/api/org/springframework/jdbc/datasource/DataSourceTransactionManager.html) transaction manager ile calismaktadir. Cunku her bir transaction'in acilan baglanti ozelinde kontrol edilmesi gerekir. 

#### <i class="icon-file"></i> @Transactional Annotation Usage