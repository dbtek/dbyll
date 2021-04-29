---
layout: post
title: Rounded img css tutorial.
categories: [programming, tutorial]
tags: [css, html, programming]
fullview: true
---

How to make a rounded img. there are several ways to do it. I'll show you the way i use the most. If you like this make sure you chek this sometimes, 
because i wil show you more of html and css.

With this way you can make your img any shape you want by changing the %.
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

<body>
 <style>
  
  img.circular--square{
            border-top-left-radius: 50% 50%;
            border-top-right-radius: 50% 50%;
            border-bottom-right-radius: 50% 50%;
            border-bottom-left-radius: 50% 50%;
            }
 
  </style>
    <img src="//www.gravatar.com/avatar/4117c229240eddd48e095bc90a0d955f?s=150" alt="logo website" class="circular--square" style="width:75px">
  </body>
