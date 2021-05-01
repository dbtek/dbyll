---
layout: post
title: Colored text css tutorial.
categories: [programming, tutorial]
tags: [css, html, programming]
description: In this tutorial i wil show you how to make colored text.
fullview: false
---

How to make colored text using css. You can change the color and text to every color and text you want. You also can youse it for all fonts.

{% highlight html %}
<html>
  <head>
    <style>
      p {
        color: green;
      }
    </style>
  </head>
  
<body>
  <p>p colored text turorial.</p>
</body>
</html>
{% endhighlight %}

This is the final result.

<html>
  <head>
    <style>
      p.color-tutorial {
        color: green;
      }
    </style>
  </head>

<body>
  <p class="color-tutorial">p colored text turorial.</p>
</body>
</html>
