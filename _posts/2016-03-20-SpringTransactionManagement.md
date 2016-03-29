---
layout: post
title: Spring Transaction Management
categories: [Spring]
fullview: true
---


**[Spring Transaction Management](http://docs.spring.io/spring/docs/current/spring-framework-reference/html/transaction.html)** incelemek icin Spring Framework'un kendi dokumantasyonu baz alarak ornekler yaptim. 


Giris
------------
Spring Transaction Management uygulama icin basit ve yonetilebilir bir uygulama catisi sunar. Java Transaction yonetimi **[JTA(Java Transaction API)](https://en.wikipedia.org/wiki/Java_Transaction_API)**,**[JDBC(Java Database Connectivity)](https://en.wikipedia.org/wiki/Java_Database_Connectivity)**,**[JPA(Java Persistence API)](https://en.wikipedia.org/wiki/Java_Persistence_API)**, **[JDO(Java Data Objects)](https://en.wikipedia.org/wiki/Java_Data_Objects)** gibi standartlar altinda toplanmistir.

-------

>**Not:** Spring Transaction API bu yapilarin herbiri ile entegre olabilir ve calisabilir. Bu entegrasyon Spring'in farkli transaction manager objeleri ile saglanir. Hibernate, JDBC ve JTA icin gerekli olan siniflar asagadaki diagramda paylasilmistir.  

-------


|                  | Spring Transaction Manager Class      | Source              |
 ----------------- | ---------------------------- | ------------------
| Hibernate | `org.springframework.orm.hibernate4.HibernateTransactionManager`            | [Source](http://docs.spring.io/spring/docs/3.2.16.RELEASE/javadoc-api/org/springframework/orm/hibernate4/HibernateTransactionManager.html) |
| JDBC          | `DataSourceTransactionManager`            | [Source](http://docs.spring.io/spring-framework/docs/2.5.x/api/org/springframework/jdbc/datasource/DataSourceTransactionManager.html) |
|  JTA         | `JtaTransactionManager` | [source](http://docs.spring.io/spring-framework/docs/2.5.5/api/org/springframework/transaction/jta/JtaTransactionManager.html) |


-------

Global Transaction icin JTA secilirken, local transactionlar icin secilen datasource'a gore txManager objesi tanimlanir. Uygulamanin ihtiyaclarina gore transaction Manager dogru data source ile iliskilendirilmelidir, Spring dokumantasyonunda ilgili konu; **[Use of the wrong transaction manager for a specific DataSource](http://docs.spring.io/spring/docs/current/spring-framework-reference/html/transaction.html#transaction-solutions-to-common-problems-wrong-ptm)**

 --------
 
#### <i class="icon-file"></i> Global Transactions


Global Transaction eger birden fazla kaynak datasource olarak kullanilacak ve aralarinda transactional bir iliski kurulmak isteniyorsa kullanilir. Birden fazla veritabani ya da message queue dan veri alinip yaziliyor ise kullanilmalidir. Eger uygulama istegi bu yonde ise JTA kullanilmasi zorunludur.

---------

#### <i class="icon-file"></i> Local Transactions

Local transaction lar tek bir kaynak ile calisan transaction yapilaridir. Coklukla uygulamalarda kullanilan yapi budur. Sadeve bir tek bir kaynaga baglanti saglanir ve bu kaynak(veritabani) ile olan iliski transactional olarak yonetilir.


---------

Declarative Transaction Management
-------------


#### <i class="icon-file"></i> tx-advice usage with AspectJ

-------

> **Not:** Nested Propagation tag'i sadece **[DataSourceTransactionManager](http://docs.spring.io/spring-framework/docs/2.5.x/api/org/springframework/jdbc/datasource/DataSourceTransactionManager.html)** transaction manager ile calismaktadir. Cunku her bir transaction'in acilan baglanti ozelinde kontrol edilmesi gerekir.


-------

#### <i class="icon-file"></i> Example Of Declerative Transaction Implementation(@Transactional Usage)

