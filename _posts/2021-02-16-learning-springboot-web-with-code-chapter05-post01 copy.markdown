---
layout: post
title: 코드로 배우는 스프링 부트 웹 프로젝트-Part3-01
date: 2021-02-15 19:00:00 0000
tags: [Intellij, SpringBoot]
categories: [SpringBoot]
description: 게시판 만들기
---

<br><br>

# <N:1(다대일) 연관관계> Board 만들기

---

여기서는 '회원'과 '게시글' 그리고 '댓글'이라는 주제로 JPA에서 연관관계를 가장 쉽게 적용할 수 있는 방법을 알아본다.
먼저 연관관계와 관계형 데이터베이스 설계를 해야 한다. :disappointed:

<br>

'회원'과 '게시글'의 관계를 다음과 같은 명제로 나타내본다.

- 한 명의 회원은 여러 게시글을 작성할 수 있다.
- 하나의 게시글은 한 명의 회원에 의해서 작성된다.

<br>

아래 사진을 보면 회원 데이터의 아이디는 PK에 해당한다. 아이디는 회원을 구분할 수 있는 고유한 값을 가지게 되는 것이다.
게시글 데이터를 보면 작성자 칼럼 값으로 동일한 회원 아이디가 여러 번 나오는 것을 볼 수 있다. 회원 데이터의 입장에서는 하나(One)의 PK(아이디)가 여러(Many) 게시글에서 참조(FK)되고 있는 관계가 된다.

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-16-21-00-46.png)

회원 데이터 쪽이 '일(one)'이고, 게시글 데이터는 동일한 회원 아이디가 여러 번 나오고 있으므로 '다(many)'로 판단하고 다음과 같이 ERD를 작성한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-16-21-05-42.png)

**데이터베이스에서 관계를 해석할 때는 항상 PK 쪽에서 해석하고, 이를 반영해야 혼란을 줄일 수 있다** :open_mouth:

<br>

즉, 앞에서 이야기했던 두 명제는 다음과 같이 해석되어야 한다.

- 한 명의 회원은 여러 개의 게시글을 작성할 수 있다(PK에서 해석)
- 하나의 게시글은 한 명의 작성자만을 표시할 수 있다.

<br>

이제 '회원, 게시글, 댓글'의 관계를 PK를 기준으로 설계해보면 다음과 같은 구조가 된다.

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-16-21-17-05.png)

회원이 있어야 게시글을 작성할 수 있으므로 회원 테이블을 먼저 설계하고 게시글을 작성할 때는 특정 회원과의 관계를 설정해 주어야 한다. 댓글은 게시글이 있어야만 작성할 수 있으므로 게시글을 우선 설계하고, 댓글 테이블이 게시글을 FK로 작성한다.

<br>

JPA는 객체지향의 입장에서 관계를 보는데 간단한 시작은 객체지향보다는 관계형 데이터베이스 모델링을 위주로 해서 구성하는 것이 편리하다.
:thumbsup:

---

<br>

## **예제 프로젝트의 생성**

<br><br>

프로젝트의 생성은 'board'라는 이름의 프로젝트로 생성하고 Gradle, War 항목을 선택한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-16-21-23-58.png)

<br>

추가할 라이브러리는 'Spring Boot DevTools, Lombok, Spring Web, Thymeleaf, Spring Data JPA 등을 추가한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-16-21-24-30.png)

<br>

MariaDB JDBC 드라이버와 Thymeleaf의 시간 처리 관련 라이브러리를 추가한다.

_"나는 mysql를 선호해서 mysql connector로 대신했다"_ :satisfied:

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-16-21-26-35.png)

<br>

application.properties 파일에는 JPA 관련 설정을 추가한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-16-21-29-06.png)

<br>

프로젝트 내에 entity 패키지를 생성하고, 이전 예제에서 사용했던 BaseEntity 클래스를 추가한다.
