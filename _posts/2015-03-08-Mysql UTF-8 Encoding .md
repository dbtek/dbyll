---
layout: post
title: Mysql UTF-8 Encoding
categories: [mysql,encoding]
fullview: true
---

Azorka projesinde veritabani olarak Myseql'i tercih ettim. Turkce destegi saglamak icin Mysql'de veritabani ve tablo olustururken UTF-8 formattinda veri tutmasi icin asagadaki scriptleri kullandim.

<script src="https://gist.github.com/muzir/ce0d66f79ab8639a31fd.js"></script>

Ancak buna ragmen ekledigim kayitlarda Turkce karakterlerin `?` karakteri ile gosterildigini gordum.


 Bir sure arastirdiktan(ve aslinda daha sonra referans olarak arkadasimin gosteridigi linki bulup okumadiktan) sonra arkadasimin onerisi ile Atlassian'in Confluence konfigurasyonu icin sundugu su [faydali linki](https://confluence.atlassian.com/doc/confluence-administrator-s-guide/managing-confluence-data/database-configuration/configuring-database-character-encoding) okudum. Buna gore baglanti bilgilerimde gerekli duzenlemeyi asagadaki gibi gerceklestirdim.
 
 {% highlight yaml %}
 
 jdbc:mysql://hostName:port/DatabaseName?useUnicode=true&characterEncoding=utf8
 
 {% endhighlight %}  
