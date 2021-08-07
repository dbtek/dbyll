---
layout: post
title: Html basics tutorial.
categories: [programming, tutorial]
tags: [html, programming]
description: In this tutorial i wil show you the basics of html.
fullview: false
comments: true
---

I'm back with a new tutorial for people who want to get started with html. Here I teach you the basics of html. 
I will also make another tutorial for scc, but that will come another time. 
html works with tags. The tag indicates what the computer should show on your screen, or what not.
The tag with the / at the beginning indicates that tag is closing something, the tag without the / indicates that it is opening something.
Before you can do anything at all, you always have to indicate what kind of file it is by <!DOCTYPE html>
at the top of your code. 
To indicate that you are working with html type <html></html> then you cannot start yet. To do that, you first have to put <body></body> between <html></html>.
Once you've done that, you can start.
We start simple. We start by projecting a sentence on your website. To display a sentence you must first type this <p1><p1></p1></p1>. In between you put your text you want.
To make a title or a heading, use h1, h2 or h3 where p1 now stands. h1 is the largest h2 and h3 are slightly smaller.


To give the background a color, type behind body in the tag style="background-color:blue;". It would look like this <body style="background-color:blue;">. 
You can of course change blue to any color you want. You only have to do that in the closing tag.
  
If you combine all that, this is your result
  
{% highlight html %}
<!DOCTYPE html>
<html>
  <body style="background-color:blue;">
  
    <h1>My first heading!</h1>
    <p1>My first text!</p1>
  
  </body>
</html>
{% endhighlight %}

This is the result.
  
    <h1>My first heading!</h1>
    <p1>My first text!</p1>
  
I hope you learned something from it. And now you can start with your own website. If you can't figure something out, you can check if I've already made a tutorial about it.
