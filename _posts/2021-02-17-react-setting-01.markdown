---
layout: post
title: 로컬에서 서버 구동시 기본 페이지를 크롬으로 설정하기
date: 2021-02-17 14:00:00 0000
tags: [React, Visual Studio Code]
categories: [React-Setting]
description: 로컬에서 yarn start시 크롬으로 열리게 하기
---

<br>

# 기본 페이지 크롬으로 설정하기

<br><br>

아 이 Internet Explorer 확 지워버리고 싶네...
시도는 안 해봤는데 지워도 문제 안 되지 않을까?<br>
~~너 컴공 맞냐?~~<br>
처음 cmd를 키고 프로젝트를 만든 다음
로컬에서 확인해보려고 yarn start를 하게 되면 윈도우의 경우
Internet Explorer가 디폴트로 열리게 된다.
**우리 모두 알다시피 IE는 뒤지게 느리다...**

그러므로 크롬으로 변경을 해줘야 하는데 은근히 쉽다.
만든 프로젝트 파일로 들어가서 명령어 한줄만 입력해주면 **끝!!**

![](/images/React_Setting/Setting01/2021-02-17-14-25-16.png)

> set BROWSER=chrome

이 명령어 한줄로 해결 완료!!!

그리고 나서 다시 yarn start를 해주면

![](/images/React_Setting/Setting01/2021-02-17-14-26-03.png)

크롬으로 열리는 것을 볼 수 있다~!

### **크롬 만세!!**
