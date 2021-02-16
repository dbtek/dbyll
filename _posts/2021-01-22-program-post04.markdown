---
layout: post
title: Intellij(인텔리제이)와 AWS의 RDS(MySql)와 S3 연동-03
image: /Program/post-4/main.jpg
date: 2021-01-22 21:15:00 0000
tags: [Intellij, AWS, RDS, S3, MySql, MySql Workbench]
categories: program
description: Intellij와 AWS의 RDS와 S3 연동
---

<br><br>
<br><br>

# <center>S3 버킷 생성</center>

<br><br>

aws 메인 홈으로 들아가서 스크롤을 조금 내리면 스토리지 카테고리에 S3가 보이는 것을 볼 수 있다.

![dashboard](........\images\Program\post-4\s3dashboard.PNG)
<br><br><br><br>

S3에 들어가면 오른 쪽 중간에 버킷 만들기 버튼을 누른다.

![makeBucket](........\images\Program\post-4\makeBucket.PNG)
<br><br><br><br>

버킷 만들기 창에 들어가면 일반 구성을 작성한다.
여기서 버킷 이름은 모든 유저들 사이에서 고유해야 한다.
그래서 나와 똑같이 하면 버킷을 만들 수 없으니 알아서 버킷 이름을 구성한다.
여기서 나는 s3-test-young으로 구성하였다. 그리고 리전은 서울로 선택한다.

![configuration](........\images\Program\post-4\configuration.PNG)
<br><br><br><br>

퍼블릭 액세스 차단을 위한 버킷 설정은 그대로 둔다.

![public](........\images\Program\post-4\public.PNG)
<br><br><br><br>

바로 밑에 버킷 버전 관리, 태그, 기본 암호화도 그대로 둔다.

![triple](........\images\Program\post-4\triple.PNG)
<br><br><br><br>

그렇게 버킷 만들기를 누르면 다 S3 버킷 만드는 것이 끝난다.

![complete](........\images\Program\post-4\complete.PNG)

---

다음 게시물에서는 인텔리제이에서 프로젝트를 만들고 실질적으로 이전 게시물에서 생성한 RDS와 S3를 연동해보도록 하겠다.
