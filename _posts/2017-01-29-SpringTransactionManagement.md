---
layout: post
title: Spring Propagation Tutorial
categories: [spring]
fullview: false
---

   Spring Transaction Management uygulama için basit ve yönetilebilir bir uygulama çatısı sunar. Java Transaction yönetimi [JTA(Java Transaction API)](https://en.wikipedia.org/wiki/Java_Transaction_API),[JDBC(Java Database Connectivity)](https://en.wikipedia.org/wiki/Java_Database_Connectivity),[JPA(Java Persistence APİ)](https://en.wikipedia.org/wiki/Java_Persistence_APİ), [JDO(Java Data Objects)](https://en.wikipedia.org/wiki/Java_Data_Objects) gibi standartlar altında toplanmıştır.

Spring Framework'ünde Transaction yönetimine başlamadan önce kısaca Transaction kavramının tanımını yapalım. İlişkisel Veritabanı Yönetim Sistemimlerinde(RDBMS)
Transaction kavramı ACID kısaltması ile tanımlanır. İngilizce Atomicity, Consistency, Isolation ve Durability kelimelerinin baş harflerinden oluşan bu kısaltma Transaction'ı oluşturan 4 ana özelliktir. Yani veritabanı üzerinde yapılan işlem bölünmez(atomic), izole(isolation), tutarlı (consistency) ve devamlılık(durability) sağlıyarak sonlanabiliyorsa bu işlem transactional bir işlemdir. Aşagıdaki örnekte basit bir kişi formu oluşturulmuş ve kişilerin eklenme adımındaki işlem için **[Spring Transaction Management](http://docs.spring.iö/spring/docs/current/spring-framework-reference/html/transaction.html)** yer alan farklı PROPAGATION değerlerinin davranışları incelenmiştir.   


Spring Propagation
-------------

	 
Örnek formu karşılayan Controller sınıfı aşağadaki şekilde oluşturulmuştur.

<script src="https://gist.github.com/muzir/d72290cbc13a2ded646d26aa8bb291d7.js"></script>


doPost metodu içinde alınan name,surname,tckNo parametreleri ile Person nesnesi oluşturulup kaydetme işlemini yapması için personService.savePerson metoduna geçilmiştir. Öncesinde gelen isteğin tümüde isteğin loglanabilemsi için requestString değişkenine atanmıştır.

Aşağıda PersonServiceİmpl#savePerson metodunda önce gelen istek kaydedilmiş ardından person nesnesi kaydedilmiş son olarakta kaydedilen person nesnesi dönüş logu olarak kaydedilmiştir.

<script src="https://gist.github.com/muzir/e923342b38203e609ceed3676e95bef6.js"></script>

Son adımda kaydedilen dönüş logunu ApiLogService içerisinde 4 farklı propagation tipinde metod karşılamaktadır. Bu metodların hepsi aynı işi yapmakla beraber Propagation tanımları farklı olduğu için gösterdikleri rollback davranışları incelenecektir. 

-------

> **Not:** Propagation kavramı incelenirken dikkat edilmesi gereken 2 önemli nokta vardır. Bir tanesi yapılan tanıma göre sistemde kaç tane transaction oluştuğu diğeri ise atılan exception'ın CheckedException(Exception sınıfından kalıtlayan) mı yoksa UncheckedException(RuntimeException sınıfından kalıtlayan) mı olduğudur. CheckedException default davranışı commit ederek akışa devam etmektir. UncheckedExceptions ise rollback yaparak akışa devam eder.

------- 

### Propagation.REQUIRED

![Figure 1-0](http://docs.spring.io/spring/docs/current/spring-framework-reference/html/images/tx_prop_required.png.pagespeed.ce.uQXwKjy4bd.png "Figure 1-0")

Yukarıdaki şekilde görüldüğü üzere REQUIRED olarak tanımlanan bir metod sistemde kendisinden önce metod hiyerarşisi içinde oluşturulan bir transaction var ise ona dahil olur. Şekilde method 2 Propagation değeri REQUIRED olarak tanımlanırsa yeni bir transaction oluşturmayacak ve method 1 transaction'ı içine dahil olacaktır.

<script src="https://gist.github.com/muzir/9b0831c537013f2d6946d4d42e238e7f.js"></script>

Senaryomuza göre savePerson metodunun Propagation.REQUIRES_NEW, saveApiRequest metodunun Propagation.REQUIRES_NEW, saveResponseRequired ise Propagation.REQUIRED olarak tanımlandığını görüyoruz. saveResponseRequired metodunda dönüş logu veritabanına kaydedildikten sonra hata durumunu simüle etmek için UnCheckedException exception değeri atılmıştır. Bu durumda önce sistemde kaç adet transaction olduğuna bakıyoruz. savePerson metodu REQUIRES_NEW(aşağıdaki adımda detaylandırılacaktır) olarak tanımlandığı için yeni bir transaction oluşturulmuştur.Bu transactiona Transaction A diyelim. saveApiRequest metodu savePerson içinde yer alır ancak REQUIRES_NEW olarak tanımlandığı için yeni bir transaction daha oluşur. Bu transactiona da Transaction B diyelim. saveResponseRequired metodu savePerson içinde yer alır PROPAGATION değeri REQUIRED'tır dolayısıyla sistemde kendinden önce yer alan metod hiyerarşinde Transaction A içine dahil olur. Yani yeni bir transaction oluşmaz. Mevcut durumda sistemde 2 adet Transaction bulunmaktadır. Form üzerinden ilgili değerleri girip kaydetmek istediğimizde Transaction A içinde saveApiRequest metodu çalışır ve Transaction A commit edilir. Ardından person nesnesi savePerson metodu yardımı ile kaydedilir ancak Transaction B saveResponseRequired ile devam ettiği için commit gerçekleşmez. saveResponseRequired metodu içinde hatanın oluşması ile birlikte Transaction B rollback edilir.


### Propagation.REQUIRES_NEW

![Figure 2-0](http://docs.spring.io/spring/docs/current/spring-framework-reference/html/images/tx_prop_requires_new.png.pagespeed.ce.iS9IQ4bj8A.png "Figure 2-0")

Yukarıdaki şekilde görüldüğü üzere REQUIRES_NEW olarak tanımlanan bir metod sistemde kendisinden önce metod hiyerarşisi içinde oluşturulan bir transaction olmasına rağmen ona dahil olmuyor ve yeni bir transaction oluşturuluyor.

<script src="https://gist.github.com/muzir/1ecd2a6758acf93bba4eda01a3490f10.js"></script>

Bu adımda ki senaryomuza göre saveResponseRequiresNew metodu üsteki senaryodan farklı olarak PROGATION.REQUIRES_NEW olarak tanımlanmış. Buna göre savePerson PROGATION.REQUİRES_NEW olarak tanımlandığı için yeni bir transaction yaratılır. Buna Transaction A diyelim. saveApiRequest metodu PROGATION.REQUİRES_NEW olarak tanımlanmıştır bu da yeni bir transaction oluşturur. Bu transactiona da Transaction B diyelim. Son olarak saveResponseRequiresNew metodu PROPAGATION.REQUIRES_NEW olarak tanımlanmıştır bu da yeni bir transaction oluşturur buna da Transaction C diyelim. Form üzerinden ilgili değerleri girip kaydetmek istediğimizde Transaction A içinde saveApiRequest metodu çalışır ve Transaction A commit edilir. Ardından person nesnesi savePerson metodu yardımı ile kaydedilir ve Transaction B commit edilir. saveResponseRequiresNew metodu içinde hatanın oluşması ile birlikte Transaction C rollback edilir. Son durumda apiLog(sadece istek loğu) ve person nesnesi kaydedilirken apiLog(dönüş logu) kaydedilememiştir.

### Propagation.MANDATORY

<script src="https://gist.github.com/muzir/411d0aaf6773f317dd0f45c95506b3ea.js"></script>

Sıklıkla kullanılmayan bir özellik olup, kendinden önce oluşturulmuş bir Transaction bekler. Aksi durumda hata verir.

### Propagation.NEVER

<script src="https://gist.github.com/muzir/2a0d4bf95d10795b8df291a70c16db83.js"></script>

Sıklıkla kullanılmayan bir özellik olup, kendinden önce hiçbir Transaction oluşturulmamış olamsini bekler. Aksi durumda hata verir.

### Propagation.NESTED

Nested Propagation tag'i sadece **[DataSourceTransactionManager](http://docs.spring.iö/spring-framework/docs/2.5.x/api/org/springframework/jdbc/datasource/DataSourceTransactionManager.html)** transaction manager ile çalışmaktadır. Çünkü her bir transaction'ın açılan bağlantı özelinde kontrol edilmesi gerekir.

### Propagation.SUPPORTS

Sıklıkla kullanılmayan bir özellik olup, kendinden önce bir transaction yaratılmış ise ona dahil olur ve onun içnde çalışır. Eğer kendinden önce yaratılmış bir transaction yok ise hata vermeden yine çalışır ancak transactional bir davranış sergilemez.

### Propagation.NOT_SUPPORTED

Sıklıkla kullanılmayan bir özellik olup, diğer tüm transaction alanlarının dışında çalıştırılır.

