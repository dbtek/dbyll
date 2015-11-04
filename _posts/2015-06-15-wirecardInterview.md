---
layout: post
title: Wirecard Interview
categories: [interview]
fullview: true
---

[Wirecard](https://www.wirecard.com) Almanya merkezli odeme sistemleri uzerine calisan bir sirket. Bir sure once Ingiliz head hunter sirketi aracigiligi ile bu sirketle bir gorusme yaptim. 
Oncesinde benzer bir sureci Pay on sirketi ile yasamistim ancak o gorusmede oncelikler codility sinavini gecemedim. Pay on surecini farkli bir yazida paylasirim. 
Wirecard su an calistigim urune benzer urunler gelsitiren bir firma. Surec head hunter sirketinin CV'mi wirecard'a iletmesi ile basladi. CV'mi bu head hunter sitesine 
bir arkadasim vasitasi ile verdim. Oncesinde head hunter sirketi ile bir gorusme yaptim. Genel olarak Cv'niz yazanlar ile sizi tanimaya calisiyorlar. Ardindan Wirecard'dan
insan kaynaklarindan biri ile telefonda gorustum. Bu gorusmem yaklasik 20 dakika surdu. Munih'te java yazilim gelistirici arayislari oldugunu ve benu ilgili takimlardan birine 
bu pozisyon icin dusunduklerini belirtti. Ardindan kendilerinden bir mail aldim. Zip dosyasi icinde undo_manager adinda bir proje gonderdiler. Proje 8-10 siniftan olusan ve arayuzleri yazilmis
uygulama siniflari ise bos birakilmis bir geri alma yonetim programiydi. Ben 3-4 sinifin uygulama(implmentation class) siniflarini yazmami calistiklarindan emin olmami, sonucta calisan degil
ama calisabilecek bir kod uretmemi istediler ve 4-5 gunluk haftasonunu da kapsayan bir zaman verdiler. Uygulamayi istedikleri sekilde undo ve redo adimlari icin ArrayList(undoList) ve Stack(redoList) kullanarak 
tamamladim.Mockito ve Junit kullanarak 10-15 tane de unit test yazdim. Projeyi istedinilen tarihten birgun oncesinde gonderdim. Yaklasik bir hafta sonra geri donduler ve 4 gun sonra bir video gorusme talep ettiler.
Gorusmenin teknik bir gorusme olacagini ve gorusmeyi yapacagim kisinin bilgilerini paylastilar. Goruscegim kisiyi LinkedIn'den buldum. 10 yillik java gelistirme tecrubesine sahip 1 spring 5'i oracle toplamda 6 java sertifikasina 
sahip Hirvat bir gelistirici ile gorusme yapacagimi ogrendim. Gorusmeyi gotoMeeting uzerinden ayarlamislardi. Mail adresine gelen bir linki tiklayip baglaniyorsunuz. Karsi tarafta iki kisi vardi, ancak 
sadece oncesinde bilgilerini verdigim gelsitirici bana sorular sordu. Mulakatin basinda kendimi tanitmami ardindan su anki isimde neler yaptigimi sordular. Sonrasinda  http://collabedit.com/ uzerinden bir java sinifi 
paylastilar. Dokuman uzerinde yaptiginiz degiskleri karsi tarafin gormsini saglayan bir arac collabedit. Kod Person sinifi kodu iceren, icinde temel toString, equals metodlari barindiran. String name, Date birthdate, 
Person Father, Person Mother gibi alt alanlari olan bir java sinifiydi. Kodu incelememi ve kod uzerinde gordugumu hata ve eksikleri soylememi istediler. equals metodunun gerceklstirimi eksikti. Complexity olan yerler vardi.
printStackTrace ile kritik verinin cataina.out a yazilabilecegi gibi seyler soyledim. Ardindan kendileri metod metod sorular sorarak ilerlediler. Bu kisim yarim saatten fazla surdu. Ardindan yine collabedit uzerinden 
bir senaryo paylastilar buna gore Person adinda bir tablo var ve bu tablonun phone alani oncesinde free format olarak telefon numaralari kabul etmis. Sonucta alanda soyle degerler var

### Ornek Degerler

{% highlight yaml %}

+0--04987343324
+49(0)43432432
00  4987343325

{% endhighlight %}

ve ardinda bu alan icin bir format belirlenmis, +4987343324 bundan sonrasi icin gelen numaralar bu formatta olucak. Ancak Person tablosu 100 000 kayittan olusuyor ve numara tam olarak esit olmasa da
ozel karakterler cikarildiginda esit olan numaralar tekrar kaydedilmek istenmiyor. Yani yeni formata gore gelen +4987343324 numarasi aslinda oncesinde su sekilde kaydedilmis +0--04987343324.
Istenen bu durumda bu tekilli nasil saglayacagin. Ben bu soruya cevap veremedim. Aslinda soyle bir kontrol yazdim

{% highlight sql %}

select count(*) from person p where escapeCharacter(p.phone)=:phone

{% endhighlight %}

ancak cozumumu devam ettiremedim. Aslinda bu soruda benden istenen bir cozum uretip onu aciklamam. Onlar tum verileri memory'e alip orada replace yapabilecegimi ya da migration ile 
farkli bir tabloya calisirken bu veriyi formatlayabilecgimi soylediler. Yani sizden cozum uretmenizi bekliyorlar. Ardindan sorular sorarak cozmunuzu savunmanizi ve gerceklestirebileceginizi 
gormek istiyorlar. Ornegin memory'e alip orada islem yapicam deseniz. 100 000 kaydi memory nasil alicaksin performansi cok kotu olur bunun icin ne yapicaksin gibi sorular ile devam edicekler.
Bu sorunun ardindan Spring ve Hibernate sorulari sordular.Hibernate tarafinda first level cache ile second level cache arasindaki farki sordular. Bu soruyu bilemedim. Ardindan database deadlock nedir diye sordular.
Bunu da veritabanina gelen iki istegin(sorgunun yada eklemenin) birbirini sonsuz bir sekilde beklemesi olarak acikladim. Spring'de Transaction yonetiminin nasil saglandigini ve @Transactional annottioon hangi
design pattern'i kullandigini sordular. Transaction yonetimini acikladim(calistigim projede ki sekilde) ancak hangi desgin patterni kullandigini bilmedigimi soyledim. Proxy patternini kullaniyormus.
Ardindan benim sorum olup olmadigini sordular. Takim ve pozisyon ile ilgili sorular sordum. Bunarin ardindan gorusme sonlandi.

Sonuc olarak gorusmede genel olarak kendimi basarili bulmadim. Eksiklerimi gormek adina benim icin iyi bir gorusme oldu. Pozitif bir donus olacagini sanmiyorum ancak bana bir tecrube kattigi kesin.     


