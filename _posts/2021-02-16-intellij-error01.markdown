---
layout: post
title: Intellij(인텔리제이) cannot resolve symbol 에러
date: 2021-02-15 19:00:00 0000
tags: [Intellij]
categories: [Intellij-Error]
description: sudden cannot resolove symbol error solution
---

<br>

# Cannot resolve symbol 에러 해결

<br>

이전에 인텔리제이로 만들었던 파일에서 확인할 것이 좀 있어서 열어봤더니 갑자기 **빨간줄** 쳐지고 난리도 아니였다. :scream:

뭐지뭐지... 하다가 gradle 멀쩡하고 import도 제대로 되어 있고 어노테이션도 확인했지만 이상이 없었다. 그래서 역시 갓Google덕분에 해결할 수 있었다.

찾아보니 이것저것 해봐야되는데 다행히 **Simple**하게 해결했다.:laughing:

> <상단 메뉴바> File->Invalidate Caches / Restart...

이것을 클릭하면 저절로 Intellij가 재시작되는데 이제 빨간줄이 사라졌다!!!..

역시 무슨 일이 일어났을 땐 Google or StackOverflow가 진리다...

---
