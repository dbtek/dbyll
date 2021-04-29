---
layout: post
title: Rounded img.
categories: [programming, tutorial]
tags: [css, html]
fullview: true
---

How to make a rounded img. there are several ways to do it. I'll show you 2 ways here. If you like this make sure you chek this sometimes, 
because i wil show you more of html and css.

#1. With this way you can make your img any shape you want by changing the %.
{% highlight yaml %}
<body>
 <style>
  img.circular--square{
            border-top-left-radius: 50% 50%;
            border-top-right-radius: 50% 50%;
            border-bottom-right-radius: 50% 50%;
            border-bottom-left-radius: 50% 50%;
            }
 
  </style>
    <img src="css-tutorial" alt="logo website" class="circular--square" style="width:75px">
  </body>
{% endhighlight %}

#2. With this way you change the whole border. 
{% highlight yaml %}
<body>
 <style>
  img.circular--square{
            border-radius: 50%;
 </style>
    <img src="css-tutorial" alt="logo website" class="circular--square" style="width:75px">
  </body>
{% endhighlight %}
