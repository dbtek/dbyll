---
layout: post
title: Thymeleaf-inline 속성
date: 2021-03-01 16:00:00 0000
tags: [Intellij, Springboot, Thymeleaf]
categories: [SpringBoot]
description: th:inline 속성
---

<br><br>

# <center>Thymeleaf-inline 속성에 대해 알아보기</center>

<br><br>

먼저 프로젝트를 생성해 보자.

![](/images/SpringBoot/Thymeleaf/2021-03-01-16-59-05.png)

<br>

의존성으로는

- Thymeleaf
- Spring Boot DevTools
- Lombok
- Spring Web

을 설정한다.

![](/images/SpringBoot/Thymeleaf/2021-03-01-16-59-53.png)

<br>

프로젝트가 완성되었으면 applicaton.properties를 열고 다음 내용을 추가해 준다.

![]./images/SpringBoot/Thymeleaf/2021-03-01-17-01-49.png)

<br>

위 설정은 Thymeleaf를 이용하는 프로젝트가 변경 후에 만들어진 결과를 보관(캐싱)하지 않도록 설정하는 것이다.

이제 아래 사진과 같이 패키지와 자바 파일을 생성한다. 그리고 코드를 적는다.

exInline() 메소드는 내부적으로 RedirectAttributes를 이용하여 '/ex3'으로 result와 dto라는 이름의 데이터를 심어서 전달한다. result는 단순한 문자열이지만, dto는 SampleDTO의 객체이다.

![](/images/SpringBoot/Thymeleaf/2021-03-01-17-07-29.png)

<br>

**SampleDTO**

```java
package org.techlead.thymeleafexample.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder(toBuilder=true)
public class SampleDTO {
    private Long sno;
    private String first;
    private String last;
    private LocalDateTime regTime;
}

```

**SampleController**

```java
package org.zerock.ex3.controller;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.zerock.ex3.dto.SampleDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Controller
@RequestMapping("/sample")
@Log4j2
public class SampleController{
    @GetMapping({"/exInline"})
    public String exInline(RedirectAttributes redirectAttributes){
        log.info("exInline..............");

        SampleDTO dto=SampleDTO.builder()
                .sno(100L)
                .first("First..100")
                .last("Last..100")
                .regTime(LocalDateTime.now())
                .build();
        redirectAttributes.addFlashAttribute("result","success");
        redirectAttributes.addFlashAttribute("dto",dto);

        return "redirect:/sample/ex3";
    }

    @GetMapping("/ex3")
    public void ex3(){
        log.info("ex3");
    }

}

```

실제 화면은 ex3.html로 확인할 수 있으므로 templates 폴더에 추가한다.

![](/images/SpringBoot/Thymeleaf/2021-03-01-17-08-50.png)

<br>

**ex3.html**

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
  <head>
    <meta charset="UTF-8" />
    <title>Title</title>
  </head>
  <body>
    <h1 th:text="${result}"></h1>
    <h1 th:text="${dto}"></h1>
    <script th:inline="javascript">

      var msg=[[${result}]]
      var dto=[[${dto}]]
    </script>
  </body>
</html>
```

<br>

ex3.html에서 가장 중요한 부분은 \<script> 태그에 사용된 th:inline 속성이다. 속성값이 javascript로 지정되었는데 이로 인해 많은 변화가 생겨난다. 브라우저에서 경로는 **'/sample/exline'**으로 호출된다.

이제 앱을 실행하고 브라우저를 킨다음 F12를 눌러 해당 url로 들어가본다.

_아래 사진과 같이 별도의 처리가 없음에도 불구하고 문자열은 자동으로 ""이 추가되어 문자열이 되는 것을 볼 수 있고 같이 전송된 dto는 JSON 포맷의 문자열이 된 것을 볼 수 있다._

만일 위의 코드를 javaScript 객체로 변환해서 사용하고자 한다면 간단히 JSON.parse('\"'+dto+'\'"); 와 같은 형태로 ""을 추가해서 사용할 수 있다.

![](/images/SpringBoot/Thymeleaf/2021-03-01-17-13-52.png)

<br>

그리고 추가적으로 script 태그에 th:inline="javascript" 속성을 정의하면 그 안에 포함된 스크립트에서는 [[..]] 표현식으로 서버 데이터를 스크립트 영역에 표현할 수 있다. 
