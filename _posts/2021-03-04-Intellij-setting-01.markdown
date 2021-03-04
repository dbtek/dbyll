---
layout: post
title: Intellij와 Git Bash 연동하기
date: 2021-03-04 10:00:00 0000
tags: [Intellij, Gitbash]
categories: [Intellij-Setting]
description: Intellij 터미널에서 Git Bash 사용하기
---

<br>

# Intellij 터미널

<br><br>

인텔리제이로 프로젝트를 하다가 깃허브에 push할 일이 생기면 매번 Git bash를 켜서 커밋하고 push를 했었는데 프로젝트 팀원 중 한 명이 꿀팁 하나를 알려주었다.
굳이 Git bash를 켜서 할 필요 없이 인텔리제이 터미널에서 바로 설정하는 것이다.

일단 Git Bash와 연동하려면 당연히 Git Bash가 미리 깔려져 있어야 한다. 그럼 시작해 보자.
아래 그림과 같이 File->Setting에 들어간다.

![](/images/Intellij_Setting/Post01/2021-03-04-10-36-24.png)

<br>

들어가면 이렇게 Settings 창이 나온다.

![](/images/Intellij_Setting/Post01/2021-03-04-10-36-53.png)

<br>

검색창에 terminal이라고 치면 아래 그림과 같이 나오고 우리가 설정해야 할 것은 바로 **Shell path** 부분이다. 그 행에 오른쪽에 폴더 모양으로 되어 있는 것을 누른다.

![](/images/Intellij_Setting/Post01/2021-03-04-10-37-23.png)

<br>

Shell path 부분 오른쪽에 폴더를 누르고 아래 그림과 같이 경로를 설정한다. Git bash가 깔려져 있는 경로로 들어가서 bin으로 들어가고 마지막으로 bash.exe로 설정해주고 ok를 누른다. 그리고 다시 Settings 창에서 ok를 눌러주면 끝난다.

![](/images/Intellij_Setting/Post01/2021-03-04-10-38-23.png)

<br>

이제 인텔리제이 하단 왼쪽에 있는 terminal를 눌러주면 아래 그림과 같이 Git bash를 사용할 수 있는 것을 알 수 있다.

![](/images/Intellij_Setting/Post01/2021-03-04-10-40-31.png)
