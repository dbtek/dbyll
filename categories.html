---
layout: page
title: Categories
header: Posts By Category
group: navigation
---

<div class="col-sm-3 col-xs-6">
    <ul class="nav nav-tabs-vertical">
      {% assign categories_list = site.categories %}
      {% if categories_list.first[0] == null %}
        {% for category in categories_list %}
            <li>
                <a href="{{ site.BASE_PATH }}/{{ site.categories_path }}#{{ category | replace:' ','-' }}-ref" data-toggle="tab">
                  {{ category | capitalize }} <span class="badge pull-right">{{ site.categories[category].size }}</span>
               </a>
            </li>
        {% endfor %}
      {% else %}
        {% for category in categories_list %}
            <li>
                <a href="{{ site.BASE_PATH }}/{{ site.categories_path }}#{{ category[0] | replace:' ','-' }}-ref" data-toggle="tab">
                    {{ category[0] | capitalize }} <span class="badge pull-right">{{ category[1].size }}</span>
                </a>
            </li>
        {% endfor %}
      {% endif %}
      {% assign categories_list = nil %}
    </ul>
</div>
<!-- Tab panes -->
<div class="tab-content col-sm-9 col-xs-6">
  {% for category in site.categories %}
    <div class="tab-pane" id="{{ category[0] | replace:' ','-' }}-ref">
      <h2 style="margin-top: 0px">Posts in {{ category[0] | capitalize }}</h2>
      <ul class="list-unstyled">
        {% assign pages_list = category[1] %}
        {% for node in pages_list %}
          {% if node.title != null %}
            {% if group == null or group == node.group %}
              <li style="line-height: 35px;"><a href="{{ site.BASE_PATH }}{{node.url}}">{{node.title}}</a> <span class="text-muted">- {{ node.date | date: "%B %d, %Y" }}</span></li>
            {% endif %}
          {% endif %}
        {% endfor %}
        {% assign pages_list = nil %}
      </ul>
    </div>
  {% endfor %}
</div>

<div class="clearfix"></div>
