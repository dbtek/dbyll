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
Change these settings in your _config.yml
<pre>
<code>
title: awesome site title
author:
  name: your_name
  email: your_email
  github: asd123
  twitter: asd123
  pinterest: asd123
  linkedin: asd123
  resume: asd123
  bio: Your stylish, minimalist theme!
  email_md5: your_email_md5_encoding
</code>
</pre>


## Posts

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>


