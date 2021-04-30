---
layout: post
title: Rounded img css tutorial.
categories: [programming, tutorial]
tags: [css, html, programming]
description: In this tutorial i wil show you how to make a rounded img.
fullview: false
---

How to make a rounded img. there are several ways to do it. I'll show you the two ways i use the most. If you like this make sure you chek my website sometimes, 
because i wil show you more of html and css.

#1. With this way you can make your img any shape you want by changing the %.
{% highlight html %}
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


#2. With this way you can make the img round by using just one line.
{% highlight html %}
<body>
 <style>
  
  img.circular--square{
            border-radius: 50%;
            }
 
  </style>
    <img src="css-tutorial" alt="logo website" class="circular--square" style="width:75px">
  </body>
{% endhighlight %}



This is the result. The result is the same for both. I hope you learned something from it. And helped with your project.

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
