---
layout: post
title: Inner Classes!
categories: [ThinkingInJava]
fullview: true
description: Sample placeholder post.
---

Java'da bir sinifi bir diger icerisinde tanimlamak mumkun.Bu yaklasim gerceklestirimi gizleme (code-hiding) olanagi saglamasinin yazninda bir dizi farkli avantajda getiriyor. Ancak bu yaklasimi kod yazarken verimli bir sekilde kullanmak zaman alan bir surec, ben Collections.sort kullanmak icin Comparator gerceklestirimleri disinda kullanmadim. Asagadaki ornek **[Inner Classes ](https://docs.oracle.com/javase/tutorial/java/javaOO/innerclasses.html)** tiplerinden biri olan **[Anonymous Classes](https://docs.oracle.com/javase/tutorial/java/javaOO/anonymousclasses.html)** tipine aittir. 
 

{% highlight java %}

 Collections.sort(myList,
                          new Comparator<Foo>() {
                               public int compare(Foo f1, Foo f2) {
                                   int someIntVal = //do comparison here.
                                   return someIntVal;
                               }
                           }
                 );

{% endhighlight %}

Bu ifade anonymous sinifinin su ozelliklerini tasir.

 - new() operatoru.

 - Uygulanan(implement) ya da kalitlanan(extend) sinif(ya da arayuzun) tanimlanmasi, bu ornekte {% highlight java %}Comparator{% endhighlight %} arayuzu kullanilmistir. 

  
### ThinkingInJava Ilgili Alistirma Kodlari

<a class="btn btn-default" href="https://github.com/muzir/ThinkingInJavaSolution ">Thinking In Java!</a>
