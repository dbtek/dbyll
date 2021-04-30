---
layout: post
title: Chrome dino hack.
categories: [programming, tutorial]
tags: [html, programming]
description: In this tutorial i wil show you how to get infinite score in the chrome dino game.
fullview: false
---

In this tutorial i wil show you how to get infinite score in the chrome dino game. The game is a easter egg. He shows him self when you dont have a internal connection, butt you dont need to switch your internal connection of. You just go to google type in chrome://dino and then it shows up. When you in the game just rightclick, click on inspect. Then click console. When you in the console type this, and press enter and start the game. Now you can let it run for hours. And get the highest score.


{% highlight html %}
Runner.instance_.gameOver = () => {}
{% endhighlight %}

I hope you did it and got a really high score.

<head>
 <style>
  img.dino{
            border-top-left-radius: 50% 50%;
            border-top-right-radius: 50% 50%;
            border-bottom-right-radius: 50% 50%;
            border-bottom-left-radius: 50% 50%;
            }
 
  </style>
  </head>
  <body>
   <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAaVBMVEX///9TU1Ps7OxQUFDi4uJDQ0Nzc3Pm5uZKSkpYWFhNTU2NjY1ubm6Hh4fNzc23t7dcXFzy8vKsrKzAwMCAgIDGxsb5+fmXl5egoKBGRkbT09N9fX1gYGCbm5v19fWlpaU9PT3a2tqSkpKqBTuvAAAFFklEQVR4nO2d23qiMBRGiygCIgdFKgdr9f0fciDRMQohiVhD8F/f3AyBslfRkMNO+vUFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8NMlhpUh60h2zGrPAV2Sx0x2zGrPAttRwYTgypm+YqBuGumOWJdk3HCpFQctekesM8FxablM1qgrWis1l+VF3/GKW3l3YBHlNf6M7fjF3hlXZ4HhcI9MN7XXWHCoq6adonGGaNIfCGIYwHBUfZrgiNc1pujWN5cVeTSzrZ6ChMjAcAzCEoe74xcAQhrrjFwNDGOqOXwwMYag7fjEwnL6h3TuLmJtvaJfrPtKt7vjFCAzzpe4AByMynOsOcDAwhOH4ERmekha6Q1ZE+LZIH3F+dMeshvCN32Jh2ENUb7XBcGx8gCF3psl3u/l9u2FxaHJ3okz1uhm5bs97ht4m6majfKehRIu6G+OWyr/Z+a/flyvkzf4i2KeIXOv/BLUK87z36+aNp1cBQx7TN1xO1fB0rROP/QmJ5hpuFpf3miDj0mBDt98Mhhr4FMO1bL80kjUcW5vGibY1O26bkRQ3Z3xL5nR7m+0NvUsPrg/FrvvjAe8Xny2a/G2VFG7yI236z/beavQI87HrM1RzezCN32r0yBsMLRj+LVKGX+qG7NqL0Rha1TZsYAeqk11zpJB8RzAEBG9khlbc4B2Y4pAeUxb0illNktojM2yw/TtDV3VZ2sWQtmlSf4SG1oPhU4IwfCcfabhnip+oRVnDki5P1KN2oW1oO9831s9VNFfDiAwb611I2dEdYpNgnhQcXf/w9cDwjcAQhjDUDwxhaIKh2k4P5hluvaphwoaU3eQNt682tCZtSL7Y0zW0g3GmV77ScDzzaizbxSLP8ydHDo0wpChsaWGoocK2JDAcKTCcgKHnDhlBJKOQbjVmw/n+ULN3nlO0g+/66u+jAYnchyd2CbT+79dmArI5M4+G6imcuoCh+YZnV3VWhtai5hhGKV2HHEiPbTjkguM4+018fo4rySdYFbpjfZJkKzlCFRuwW243xUru5W+uYZZFEzes+8T7jjdHq6LVbLicq8I0nZebtmG1btbzljbH8Ef5fpJwDYPfhRq/Z+bqdj6NvyYFs5xjGNqK95PE5hqWfnu5cS9uf8aQn5KCOdcwVr2hFD4/7WjlKBKw6S/qhkWpekNJuIbJTBW2aaJumCnfTxKu4TDuDcmH+GK4IB+eMdSlw7gzjEneL62IlhX5z7QM/RV589A5l4zU4GE8LcPvVjFdjw9DaWbLC2/sh73VMEljMuVeedFrfqAMF0OyfOnvDZ1LYyEfasi+IgUjD9TQrlrLFCgvNixjijXQ8OdMa/qGSrApHDXMT62lJpTXGmb0NjUD58iT9NZydAUZytRwwSseaV2apO5tY799/7lmGmabW6b6WbC+00zDr4yl/1RDDRWQMzR1NLGBGro7smK5LXIx3JPisPPzEOpe6Szg2qZpOkou741PmwR+96h+XXHrXeksQKrVdinmGLr+HxsWuxuC78uMnsX+BU0FQ87c08Epy/bRkIkqHDijU1reFWvdf2pRNefavJGo5wy790qsmKiCgftHMmNtlwEILnSY7O7rFubMIFyHIbNvIOdT2o13i8oPBv7Z1VVwox3iHYVDzmIbckXFXN5u4c0cpvis0KtjrysHPkOFjkTWPutu5KzjckExl7tRNGMyHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgE/kH/ZhfYcT3Nb2AAAAAElFTkSuQmCC" alt="dino" style="width=75px" class="dino">
  </body>
