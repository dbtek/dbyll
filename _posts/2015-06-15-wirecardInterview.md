---
layout: post
title: Wirecard Interview
categories: [interview]
fullview: false
---

[Wirecard](https://www.wirecard.com) Almanya merkezli ödeme sistemleri üzerine çalışan bir şirket. Bir süre önce İngiliz head hunter şirketi aracılığı ile bu şirketle bir görüşme yaptım.
Öncesinde benzer bir süreci Pay on şirketi ile yaşamıştım ancak o görüşmede codility sınavını geçemedim.
Wirecard şu an çalıştığım ürüne benzer ürünler geliştiren bir firma. Süreç head hunter şirketinin CV'mi wirecard'a iletmesi ile başladı. CV'mi bu head hunter sitesine
bir arkadaşım vasıtası ile verdim. Öncesinde head hunter şirketi ile bir görüşme yaptım. Genel olarak Cv'nizde yazanlar ile sizi tanımaya çalışıyorlar. Ardından Wirecard'dan
insan kaynaklarından biri ile telefonda görüştüm. Bu görüşmem yaklaşık 20 dakika sürdü. Münih'te java yazılım geliştirici arayışları olduğunu ve beni ilgili takımlardan birine
düşündüklerini belirtti. Ardından kendilerinden bir mail aldım. Zıp dosyası içinde undo_manager adında bir proje gönderdiler. Proje 8-10 sınıftan oluşan ve arayüzleri yazılmış
uygulama sınıfları ise boş bırakılmış bir geri alma yönetim programıydı. Ben 3-4 sınıfın uygulama(implementation class) sınıflarını yazmamı çalıştıklarından emin olmamı, sonuçta çalışan değil
ama çalışabilecek bir kod üretmemi istediler ve 4-5 günlük haftasonunu da kapsayan bir zaman verdiler. Uygulamayı istedikleri şekilde undo ve redo adımları için ArrayList(undoList) ve Stack(redoList) kullanarak
tamamladım.Mockito ve Junit kullanarak 10-15 tane de unit test yazdım. Projeyi istenilen tarihten birgün öncesinde gönderdim. Yaklaşık bir hafta sonra geri döndüler ve 4 gün sonra bir video görüşme talep ettiler.
Görüşmenin teknik bir görüşme olacağını ve görüşmeyi yapacağım kişinin bilgilerini paylaştılar. Görüşmeyi gotoMeeting üzerinden ayarlamışlardı. Görüşmede karşı tarafta iki kişi vardı, ancak
sadece öncesinde bana bilgileri verilen gelsitirici sorular sordu. Mülakatın başında kendimi tanıtmamı ardından şu anki isimde neler yaptığımı sordular. Sonrasında  http://çollabedit.com/ üzerinden bir java sınıfı
paylaştılar. Doküman üzerinde yaptığınız değişikleri karşı tarafın görmesini sağlayan bir araç collabedit. Kod Person sınıfı kodu içeren, içinde temel toString, equals metodları barındıran. String name, Date birthdate,
Person Father, Person Mother gibi alt alanları olan bir java sınıfıydı. Kodu incelememi ve kod üzerinde gördüğüm hata ve eksikleri söylememi istediler. equals metodunun gerçekleştirimi eksikti. Complexity olan yerler vardı.
printStackTrace ile kritik verinin cataina.out a yazılabileceği gibi şeyler söyledim. Ardından kendileri metod metod sorular sorarak ilerlediler. Bu kısım yarım saatten fazla sürdü. Ardından yine çollabedit üzerinden
bir senaryo paylaştılar buna göre Person adında bir tablo var ve bu tablonun phone alanı öncesinde free format olarak telefon numaraları kabul etmiş. Sonuçta alanda şöyle değerler var

### Örnek Değerler

{% highlight yaml %}

+0--04987343324
+49(0)43432432
00  4987343325

{% endhighlight %}

ve ardında bu alan için bir format belirlenmiş, +4987343324 bundan sonrası için gelen numaralar bu formatta olucak. Ancak Person tablosu 100 000 kayıttan oluşuyor ve numara tam olarak eşit olmasa da
özel karakterler çıkarıldığında eşit olan numaralar tekrar kaydedilmek istenmiyor. Yani yeni formata göre gelen +4987343324 numarası aslında öncesinde şu şekilde kaydedilmiş +0--04987343324.
İstenen bu durumda bu tekilliği nasıl sağlayacağın. Ben bu soruya cevap veremedim. Aslında şöyle bir kontrol yazdım

{% highlight sql %}

select count(*) from person p where escapeCharacter(p.phone)=:phone

{% endhighlight %}

ancak çözümümü devam ettiremedim. Aslında bu soruda benden istenen bir çözüm üretip onu açıklamam. Onlar tüm verileri memory'e alıp orada replace yapabileceğimi ya da migration ile
farklı bir tabloya çalışırken bu veriyi formatlayabilecğimi söylediler. Yani sizden çözüm üretmenizi bekliyorlar. Ardından sorular sorarak çözmünüzü savunmanızı ve gerçekleştirebileceğinizi
görmek istiyorlar. Örneğin memory'e alıp orada işlem yapıcam deseniz. 100 000 kaydı memory nasıl alicaksın performansı çok kötü olur bunun için ne yapıcaksın gibi sorular ile devam edicekler.
Bu sorunun ardından Spring ve Hibernate soruları sordular.Hibernate tarafında first level cache ile second level cache arasındaki farkı sordular. Bu soruyu bilemedim. Ardından database deadlock nedir diye sordular.
Bunu da veritabanına gelen iki isteğin(ekleme işlemi) birbirini sonsuz bir şekilde beklemesi olarak açıkladım. Spring'de Transaction yönetiminin nasıl sağlandığını ve @Transactional annotion hangi
design pattern'i kullandığını sordular. Transaction yönetimini açıkladım(çalıştığım projede ki şekilde) ancak hangi desgin patterni kullandığını bilmediğimi söyledim. Proxy patternini kullanıyormuş.
Ardından benim sorum olup olmadığını sordular. Takım ve pozisyon ile ilgili sorular sordum. Bunarın ardından görüşme sonlandı.

Sonuç olarak görüşmede genel olarak kendimi başarılı bulmadım. Eksiklerimi görmek adına benim için iyi bir görüşme oldu. Pozitif bir dönüş olacağını sanmıyorum ancak bana bir tecrübe kattığı kesin.


