---
layout: post
title: 코드로 배우는 스프링 부트 웹 프로젝트-Part2-04
date: 2021-03-04 14:00:00 0000
tags: [Intellij, SpringBoot, Guesbook]
categories: [SpringBoot]
description: 방명록 만들기
---

<br><br>

# <center>등록 페이지와 등록 처리</center>

<br>

등록의 처리는 이미 GuestbookService까지 완성되었기 때문에 GuestbookController에 약간의 코드를 추가해서 처리가 가능하다. 우선은 GuestbookController에 @GetMapping과 @PostMapping을 이용해서 등록 작업을 처리하는 메서드를 작성한다.

**GuestbookController.java**

```java
(...)
    @GetMapping("/list")
    public void list(PageRequestDTO pageRequestDTO, Model model) {

        log.info("list............." + pageRequestDTO);

        model.addAttribute("result", service.getList(pageRequestDTO));

    }
    @GetMapping("/register")
    public void register() {
        log.info("regiser get...");
    }

    @PostMapping("/register")
    public String registerPost(GuestbookDTO dto, RedirectAttributes redirectAttributes) {

        log.info("dto..." + dto);

        //새로 추가된 엔티티의 번호
        Long gno = service.register(dto);

        redirectAttributes.addFlashAttribute("msg", gno);

        return "redirect:/guestbook/list";
    }
    (...)
```

<br>

등록 작업은 GET 방식에서는 화면을 보여주고, POST 방식에서는 처리 후에 목록 페이지로 이동하도록 설계한다. 이때 RedirectAttributes를 이용해서 한 번만 화면에서 'msg'라는 이름의 변수를 사용할 수 있도록 처리한다. RedirectAttributes는 list.html로 내부적으로 msg라는 이름의 데이터를 심어서 전달한다. addFlashAttribute()는 단 한 번만 데이터를 전달하는 용도로 사용한다. 브라우저에 전달되는 'msg'를 이용해서는 화면 상에 모달 창을 보여주는 용도로 사용할 것인데, 글이 등록된 후에 자동으로 아래 그림과 같은 모달 창이 보이게 처리한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-05-10-41-56.png)

<br>

등록 화면 register.html은 부트스트랩의 Form 태그를 이용하는 방식을 참고로 해서 다음과 같이 구성한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-05-10-43-10.png)

<br>

**register.html**

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">

<th:block th:replace="~{/layout/basic :: setContent(~{this::content} )}">

    <th:block th:fragment="content">

        <h1 class="mt-4">GuestBook Register Page</h1>

        <form th:action="@{/guestbook/register}" th:method="post">
            <div class="form-group">
                <label >Title</label>
                <input type="text" class="form-control" name="title" placeholder="Enter Title">
            </div>
            <div class="form-group">
                <label >Content</label>
                <textarea class="form-control" rows="5" name="content"></textarea>
            </div>
            <div class="form-group">
                <label >Writer</label>
                <input type="text" class="form-control" name="writer" placeholder="Enter Writer">
            </div>

            <button type="submit" class="btn btn-primary">Submit</button>
        </form>

    </th:block>

</th:block>

```

<br>

위 코드에서 th:action 속성은 폼 데이터(form data)를 서버로 보낼 때 해당 데이터가 도착할 URL을 명시한다. 여기서는 /guestbook/register를 명시하고 method를 post로 해놨는데 폼으로 입력되는 데이터들이 우리의 GuestbookController 클래스에

```java
@PostMapping("/register")
    public String registerPost(GuestbookDTO dto, RedirectAttributes redirectAttributes) {

        log.info("dto..." + dto);

        //새로 추가된 엔티티의 번호
        Long gno = service.register(dto);

        redirectAttributes.addFlashAttribute("msg", gno);

        return "redirect:/guestbook/list";
    }
```

<br>

registerPost 메소드에게 보내져서 파라미터에 GuestbookDTO dto에게 매핑되어 데이터가 자동수집된다. 즉 각 <input> 태그에는 적절한 name 값을 지정해야 하는데 GuestbookDTO로 수집될 데이터이므로 동일하게 맞춰주면 자동 수집이 된다. 브라우저로 입력 화면을 확인하면 아래의 왼쪽 화면이 보이고 방명록(게시물) 등록 후에 목록 화면으로 이동하는 것을 확인할 수 있다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-05-11-05-53.png)

<br>

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-05-11-06-07.png)

<br>

등록 처리는 POST 방식으로 이루어지고 자동으로 '/guestbook/list'로 이동하도록 처리되어 있다. 처리된 후에 목록 화면에서는 '처리되었다는' 결과를 보여줄 필요가 있으므로 부트스트랩의 모달창을 이용해서 이를 처리한다. 우선은 list.html 화면에서 JavaScript를 이용해서 등록한 후에 전달되는 msg 값을 확인한다.

**list.html 일부**

```html
</ul>

        <script th:inline="javascript">
            var msg=[[${msg}]];
            console.log(msg);
        </script>
```

<br>

앱을 실행하고 register.html에서 폼을 입력하고 submit를 하게 되면 제대로 처리가 되지 않는 것을 볼 수 있다. 그 이유는 우리가 modelMapper를 사용할 때 제대로 설정을 해주지 않은 상태에서 mapping를 시도했기 때문이다. ModelMapper 설정을 해주기 위해서 아래와 같이 프로젝트를 만든다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-05-13-36-26.png)

<br>

그리고 코드를 입력한다.

**ModelMapperUtil.java**

```java
package org.techlead.guestbook.config;

import org.modelmapper.ModelMapper;
import org.modelmapper.config.Configuration;


public class ModelMapperUtil {
    private static ModelMapper modelMapper;
    public static ModelMapper getModelMapper(){
        modelMapper=new ModelMapper();
        modelMapper.getConfiguration()
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(Configuration.AccessLevel.PRIVATE);
        return modelMapper;
    }
}

```

<br>

그리고 다시 GuestbookService 클래스를 수정한다.

**GuestbookService.java**

```java
package org.techlead.guestbook.service;

import lombok.Builder;
import org.modelmapper.ModelMapper;

import org.techlead.guestbook.config.ModelMapperUtil;
import org.techlead.guestbook.dto.GuestbookDTO;
import org.techlead.guestbook.dto.PageRequestDTO;
import org.techlead.guestbook.dto.PageResultDTO;
import org.techlead.guestbook.entity.Guestbook;



public interface GuestbookService {
    Long register(GuestbookDTO dto);
    @Builder.Default
    ModelMapper modelMapper= ModelMapperUtil.getModelMapper();
    PageResultDTO<GuestbookDTO, Guestbook> getList(PageRequestDTO requestDTO);

    default Guestbook dtoToEntity(GuestbookDTO dto){
        Guestbook entity=modelMapper.map(dto,Guestbook.class);

        return entity;
    }


    default GuestbookDTO entityToDto(Guestbook entity){
        GuestbookDTO dto=modelMapper.map(entity,GuestbookDTO.class);
        return dto;
    }
}

```

이제 modelMapper 관련해서 제대로 mapping이 동작할 것이다. 다시 앱을 실행해서 등록 작업을 시행해 본다. Thymeleaf의 inline 속성을 이용해서 처리하면 별도의 타입 처리가 필요하지 않기 때문에 만일 새로운 글이 등록되면 다음과 같이 번호가 출력된다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-05-13-25-10.png)

<br>

이제 msg 변수의 값을 이용해서 모달창을 실행해 본다.

<br>

**[모달창 참고 Bootstrap 링크](https://getbootstrap.com/docs/4.2/components/modal/)**

<br>

**list.html 일부**

```html
(...)
</li>

        </ul>
        <div class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Modal title</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Modal body text goes here.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>

        <script th:inline="javascript">
            var msg=[[${msg}]];
            console.log(msg);
            if(msg){
                $(".modal").modal();
            }
        </script>

```

<br>

> #### **line 26:** GuestbookController에서 redirectAttributes.addFlashAttribute("msg", gno) 으로 넘겨준 msg 값을 받는다.<br>
>
> #### **line 29:** jquery에서 $(.xxx)의 의미는 class 속성이 xxx인 엘리먼트를 의미한다.<br>

<br>

최종 실행 결과는 다음 그림처럼 새로운 글이 등록된 후에는 모달창이 우선 보이게 된다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-05-13-48-08.png)

<br>

목록 페이지에서 마지막으로 남은 작업은 새로운 글을 작성할 수 있는 링크를 제공하는 것과 목록에 있는 각 글의 번호나 제목을 클릭했을 때 조회 페이지로 이동하는 작업이다. 등록 페이지로 가는 링크는 <table>의 위쪽에 버튼을 추가해 주도록 한다.

**list.html 일부**

```html
<th:block th:fragment="content">
  <h1 class="mt-4">
    GuestBook List Page
    <span>
      <a th:href="@{/guestbook/register}">
        <button type="button" class="btn btn-outline-primary">REGISTER</button>
      </a>
    </span>
  </h1>
  <table class="table table-striped"></table
></th:block>
```

<br>

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-05-14-11-38.png)

<br>
