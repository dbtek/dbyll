---
layout: post
title: Mysql UTF-8 Encoding
categories: [mysql,encoding]
fullview: true
---

Azorka projesinde veritabani olarak Myseql'i tercih ettim. Turkce destegi saglamak icin Mysql'de veritabani ve tablo olustururken UTF-8 formattinda veri tutmasi icin asagadaki scriptleri kullandim.

<script src="https://gist.github.com/muzir/ce0d66f79ab8639a31fd.js"></script>

Ancak buna ragmen ekledigim kayitlarda Turkce karakterlerin `?` karakteri ile gosterildigini gordum.

> Temmuz 1883'te Prag’da ufak moda e?yalar satan bir dükkan i?leten Hermann ve Julie Kafka'n?n 6 çocu?unun ilki olarak dünyaya gelmi?tir. ?ki erkek karde?i daha bebekken ölmü?tür. 3 k?z karde?i de kendinden uzun ya?am??t?r. Hukuk okumu?, bo? zamanlar?nda yazmaya ba?lam??t?r. Yaz?lar?, ilk olarak Betrachtung, 1912 y?l?ndan itibaren yay?mlanmaya ba?lam??t?r. Kafka'n?n duygusal deneyimleri ve ailesiyle olan ili?kileri eserlerinde özellikle günlük ve mektuplar?nda ifade bulmu?tur. Babaya Mektup'ta (Almanca: Brief an den Vater) Kafka'n?n bak?? aç?s?ndan babas?yla olan ili?kisi gözükmektedir. Hayatta oldu?u süre içerisinde 7 kitap yazm??t?r, bunlar?n yan?nda 3 tamamlanmam?? roman ve birçok mektup ve günlük b?rakm??t?r gerisinde. Kafka yak?n arkada?? Max Brod'dan öldü?ünde tüm bu eserlerini yakmas?n? istemi?tir. Max Brod'un Kafka'n?n bu iste?ini yerine getirmemesi sayesinde bugün bu eserleri okuma ?ans?na sahibiz. Kafka tüm eserlerini Almanca yazm??t?r. Kafka modernist yazar olarak görülmektedir. Eserlerinde suç, özgürlük, yabanc?la?ma ve sorumluluk ayr?ca otoriteye bireysel kar?? koyma gibi temalar? i?lemi?tir. Kafka’n?n en tan?nm?? eserleri Dava, ?ato ve 

 Bir sure arastirdiktan(ve aslinda daha sonra referans olarak arkadasimin gosteridigi linki bulup okumadiktan) sonra arkadasimin onerisi ile Atlassian'in Confluence konfigurasyonu icin sundugu su [faydali linki](https://confluence.atlassian.com/doc/confluence-administrator-s-guide/managing-confluence-data/database-configuration/configuring-database-character-encoding) okudum. Buna gore baglanti bilgilerimde gerekli duzenlemeyi asagadaki gibi gerceklestirdim.
 
 jdbc:mysql://hostName:port/DatabaseName?useUnicode=true&characterEncoding=utf8
 
 
