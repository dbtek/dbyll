---
layout: post
title: 스프링부트로 만드는 코로나 바이러스 트래커 어플리케이션-01
image: /Program/post-7/main.jpg
date: 2021-02-22 09:00:00 0000
tags: [Intellij, Springboot, Corona Virus Tracker App]
categories: Springboot
description: Corona Virus Tracker App
---

<br><br>
<br><br>

# <center>스프링부트로 코로나 바이러스 트래커 만들기-01</center>

<br><br>

_이 프로젝트는 **Java Brains** 유투브 영상을 보며 공부한 것을 정리하기 위해서 남김을 알립니다. 영상과는 조금 다를 수 있음을 알립니다._

[Youtube 영상](https://www.youtube.com/watch?v=8hjNG9GZGnQ)

---

스프링부트로 만들만한 실습을 찾아보다가 굉장히 좋은 영상을 하나 발견했다. 바로 코로나 바이러스 트래커에 대한 실습을 담은 영상인데 위에 링크를 달아놨다. 이 앱은 코로나 바이러스 확진자 수를 실시간으로 나라별로 트래킹하고 전세계 전체 확진자 수를 보여준다.

이번 게시물에서는 그 영상을 보면서 따라하고 그리고 공부해 가면서 스프링 부트에 좀 더 다가가는 시간을 갖도록 해본다.

먼저 만들고자 하는 페이지를 살펴보자. 왼쪽 상단에는 전세계 전체 확진자 수가 있고 그 바로 밑에는 전날과 비교해서 몇명이 늘었는지 보여주는 수가 있다. 또 그 밑 가장 왼쪽에서부터 State, Country, Total Cases Reported 그리고 마지막으로 Changes since last day가 있다.

해석하면 각 나라의 주, 나라, 전체 확진자, 전날과 비교라고 할 수 있겠다.

![](/images/Program/post-7/2021-02-22-09-58-10.png)

<br>

사진을 보면 State 열에 빈 공간이 좀 있는데 이는 그 나라가 주가 없기 때문에 비어있는 것이다.

영상에서 보여주는 이 앱은 매일 최신으로 바뀌는 나라별 확진자 수를 csv로 받아와서 최신 정보로 업데이트 해줄 것이다.

_영상을 보면서 참 씁슬 했던 것이 저 때는 나라별 확진자 수가 지금이랑 말도 안 되게 적다.. 참 저땐 몰랐지... 이렇게 파급력이 클줄은.._

자 이제 시작해보자.

_**개발로는 인텔리제이를 사용한다**_

새로운 프로젝트를 만든다.

- 영상에서는 인텔리제이 Community 버젼으로 하지만 나는 대학생 인증을 받아서 무료로 Ultimate 버젼을 씀
- 동영상에서는 Maven으로 작업을 하지만 나는 Gradle로 설정을 하고 Packaing은 War로 설정

![](/images/Program/post-7/2021-02-22-10-08-06.png)

<br>

dependencies 설정은 Spring Boot DevTools, Spring Web 그리고 Thymeleaf로 하고 생성한다.

![](/images/Program/post-7/2021-02-22-10-13-09.png)

자 이제 프로젝트가 생성이 됐다. 이제 한 번 생각을 해보자. 우리는 데이터를 가지고 올 곳이 필요하다.

그래야 웹에서 매일 업데이트 되는 확진자 수를 보여줄 수 있다.

우리가 사용할 수 있는 사이트가 하나 있다.

![](/images/Program/post-7/2021-02-22-10-19-17.png)

<br>

**[Github Link](https://github.com/CSSEGISandData/COVID-19)**

이 깃허브 링크에 들어가면 전세계 확진자 수를 매일 업데이트한 csv 파일들이 있다.

아래 사진과 같이 COVID-19/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv의 csv 파일을 보면 이렇게 국가별로 날짜 별 확진자 수를 잘 정리한 것을 볼 수 있다. 스크롤을 오른쪽으로 쭉 밀면 현재 이 포스트를 쓰는 21년 2월 22일의 확진자 수를 보여주고 있음을 알 수 있다.

![](/images/Program/post-7/2021-02-22-10-22-01.png)

<br>

이제 위 사진에서 오른쪽 중간 쯤에 있는 Raw 버튼을 눌러보자.

![](/images/Program/post-7/2021-02-22-10-28-37.png)

<br>

그러면 이러한 창으로 바뀌는데 우리는 이 데이터를 이용할 것이다. 그럼으로 이 url를 복사해 두자!!

url: https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv

<br>

우리가 하고자하는 궁국적인 목적은 이 url를 사용해서 스프링부트 어플리케이션이 로딩하면 이 csv 파일로 GET Request를 해서 이러한 데이터들을 나에게 사용가능하게 만드는 것이다. Parse해서 페이지에게 제공하고 우리가 설정한 포맷대로 랜더링할 수 있도록 하는 것이다.

대략적인 설명은 여기까지 하고 다음 게시물에서 본격적인 프로그래밍을 시작해보자.
