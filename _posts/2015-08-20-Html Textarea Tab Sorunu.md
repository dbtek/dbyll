---
layout: post
title: Html Textarea Tab Sorunu
categories: [UI]
fullview: true
---

Azorka projesinde bir suredir arayuz tarafinda karsilastigim bir sorun vardi. Sorun textarea araclarinin icinde default olarak gelen karakterler. Sorunu bir suredir erteledim. Arayuzde tarafinda Twitter Bootstrap ve [Bootswatch](https://bootswatch.com) kullandigim icin bir uyumsuzluktan kaynaklandigini dusunuyordum. Asagida sorun yasadigim kod blogu mevcut.

{% highlight html %}
<textarea name="comment" 
	class="form-control" 
	id="comment" rows="10" 
	cols="50" maxlength="4000" 
	placeholder="Yorumunuzu buraya ekleyebilirsiniz" 
	autocomplete="off" required>
</textarea>
{% endhighlight %}  

Yukardaki kod calistiginda uretilen sayfadaki textbox icinde 5 adet tab karakteri bulunduruyordu. Ardindan internette yaptigim aramalarda bu faydali [Stackoverflow soru cevabini](http://stackoverflow.com/questions/2202999/why-is-textarea-filled-with-mysterious-white-spaces) buldum. Sorun basit olarak kod formatlamadan kaynaklaniyor. Textarea araci `<textarea>`  ve `</textarea>` arasindaki karakterleride bu aracin icerigine dahil ediyor ve arac baslarken arasinda bulunanan tab karakterlerinide iceriyor. Sorunu cozmek icin `<textarea>` aracini asagadaki sekilde tek satirda tanimlayarak kullaniyorum.

{% highlight html %}
<textarea name="comment" class="form-control" id="comment" rows="10" cols="50" maxlength="4000" placeholder="Yorumunuzu buraya ekleyebilirsiniz" autocomplete="off" required></textarea>
{% endhighlight %}   