---
layout: post
title: Intellij(인텔리제이)와 AWS의 RDS(MySql)와 S3 연동-02
image: /Program/post-3/main.jpg
date: 2021-01-21 19:40:00 0000
tags: [Intellij, AWS, RDS, S3, MySql, MySql Workbench]
categories: program
description: Intellij와 AWS의 RDS와 S3 연동
---

<br><br>
<br><br>

# <center>인텔리제이와 RDS 연동</center>

<br><br>

전의 게시물에서 마지막에 데이터베이스 생성을 눌렀다면 상태 컬럼에 보면
생성중에서 이제는 <u>사용 가능</u>으로 바뀐 것을 볼 수 있다.

![creation_complete](........\images\Program\post-2\creation_complete.PNG)
<br><br><br><br>

여기서 DB 식별자인 rdsDB를 누르면 아래 그림이 나오게 되는데
이때 엔드포인트를 복사 해 놓는다.

![endpoint](........\images\Program\post-2\endpoint.PNG)
<br><br><br><br>

이제 MySql Workbench를 켜본다.
![home](........\images\Program\post-3\mysql_home.PNG)
<br><br><br><br>

아래 사진과 같은 플러스로 되어 있는 부분을 누르게 되면
![add](........\images\Program\post-3\plus.PNG)
<br><br><br><br>

여기서 Connection Name에는 원하는 db이름을 적고
Username에서는 이전 게시물에서 설정했던 마스터 유저 이름을 적는다
그리고 Sore in Vault를 눌러서 마찬가지로 이전 게시물에서 설정했던 마스터 암호를 적는다. 그 다음 OK를 누른다.
![connection](........\images\Program\post-2\connection.PNG)
<br><br><br><br>

rds-test가 생긴 것을 볼 수 있다.
이것을 누르면 따로 암호를 칠 필요 없이 들어가지는 것을 볼 수 있다.
![rds test](........\images\Program\post-2\rds-test.PNG)
<br><br><br><br>

---

다음 게시물에서는 AWS의 S3 버킷을 만들어 본다.
