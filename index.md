---
layout: page
title: dbyll
tagline:
---


## Hello World!

**dbyll** is minimalist, stylish theme for jekyll. Supports gravatar, account links (github, twitter, e-mail, pinterest, résume file) and a bio.  

**dbyll** is brought to you by **[dbtek](http://ismaildemirbilek.com)**. Open sourced under [MIT](http://opensource.org/licenses/MIT) license.
  
### dbyll is on GitHub
<a class="btn btn-default" href="https://github.com/dbtek/dbyll">Grab your copy now!</a>

## Configuration

In your config file change these settings
<pre>
<code>
title: dbyll
author:
  name: yourname
  email: youremail
  github: asd123
  twitter: asd123
  pinterest: asd123
  linkedin: asd123
  resume: asd123
  bio: Your stylish, minimalist theme!
  email_md5: md5ofemail
</code>
</pre>


## Posts

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ site.BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>


