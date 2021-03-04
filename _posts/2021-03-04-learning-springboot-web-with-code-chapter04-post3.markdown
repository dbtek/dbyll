---
layout: post
title: 코드로 배우는 스프링 부트 웹 프로젝트-Part2-03
date: 2021-03-04 14:00:00 0000
tags: [Intellij, SpringBoot, Guesbook]
categories: [SpringBoot]
description: 방명록 만들기
---

<br><br>

# <center>목록 데이터 페이지 처리하기</center>

<br>

이전 게시물에서 이야기 나눴던 내용을 코드로 옮겨본다.

**PageResultDTO.java**

```java
package org.techlead.guestbook.dto;

import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Data

public class PageResultDTO<DTO, EN> {
    private List<DTO> dtoList;
    private int totalPage;
    private int page;
    private int size;
    private int start, end;
    private boolean prev, next;
    private List<Integer> pageList;

    public PageResultDTO(Page<EN> result, Function<EN,DTO> fn){
        dtoList=result.stream().map(fn).collect(Collectors.toList());
    }

    private void makePageList(Pageable pageable){
        this.page=pageable.getPageNumber()+1;
        this.size=pageable.getPageSize();


        int tempEnd=(int)(Math.ceil(page/10.0))*10;

        start=tempEnd-9;

        prev=start>1;

        end=totalPage>tempEnd?tempEnd:totalPage;

        next=totalPage>end;
        pageList= IntStream.rangeClosed(start,end).boxed().collect(Collectors.toList());
    }
}

```

<br>

> #### **line 16:** 총 페이지 번호<br>
>
> #### **line 17:** 현재 페이지 번호<br>
>
> #### **line 18:** 목록 사이즈<br>
>
> #### **line 19:** 시작 페이지 번호, 끝 페이지 번호<br>
>
> #### **line 20:** 이전, 다음<br>
>
> #### **line 21:** 페이지 번호 목록<br>
>
> #### **line 28:** 0부터 시작하므로 1를 더해준다<br>
>
> #### **line 29:** 페이지 사이즈를 가져온다.<br>
>
> #### **line 34:** 페이지의 start는 그 페이지의 끝 번호의 9를 빼면 된다<br>
>
> #### **line 36:** start가 존재하면 prev도 존재한다<br>
>
> #### **line 38:** totalPage가 더 많으면 해당 페이지는 10개씩 다 보여준다.<br>
>
> #### **line 40:** next 버튼은 totalPage가 끝 번호 보다 많을 때 보여주게 한다.<br>

<br>

앞에서 만든 테스트 코드를 수정해서 위와 같은 정보들이 제대로 구성되었는지 확인 해 본다.

**GuestbookServiceTests.java**

```java
@Test
    public void testList(){
        PageRequestDTO pageRequestDTO=PageRequestDTO.builder().page(1).size(10).build();
        PageResultDTO<GuestbookDTO, Guestbook> resultDTO=service.getList(pageRequestDTO);
        System.out.println("PREV: "+resultDTO.isPrev());
        System.out.println("NEXT: "+resultDTO.isNext());
        System.out.println("TOTAL: "+resultDTO.getTotalPage());
        System.out.println("start: "+resultDTO.getStart());
        System.out.println("tempEnd: "+resultDTO.getEnd());
        System.out.println("page: "+resultDTO.getPage());
        System.out.println("-----------------------------------------");
        for(GuestbookDTO guestbookDTO : resultDTO.getDtoList()){
            System.out.println(guestbookDTO);
        }
        System.out.println("========================================");
        resultDTO.getPageList().forEach(i->System.out.println(i));
    }
```

<br>

결과는 아래와 같다. 처리된 결과를 보면 현재 페이지가 1인 경우 PREV는 false, NEXT는 true 등의 처리 결과를 확인할 수 있고, 마지막의 번호는 화면상에서 출력되어야 하는 페이지의 번호이다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-04-14-59-51.png)

<br>

이제 서비스 계층까지 등록 작업과 목록 처리가 완료되었으니 컨트롤러를 작성하고 실제 화면이 이를 반영해본다. GuestbookController에는 우선은 목록을 처리하기 위해서 '/guesbook/list'로 처리되는 부분을 다음과 같이 처리한다.

**GuestbookController.java**

```java
(...)
@Controller
//guestbook으로부터 시작해서 guestbook/register, guestbook/list 이런식으로 사용
@RequestMapping("/guestbook")
@Log4j2
@RequiredArgsConstructor //자동 주입을 위한 Annotation
public class GuestbookController {

    private final GuestbookService service; //final로 선언

    @GetMapping("/")
    public String index() {

        return "redirect:/guestbook/list";
    }


    @GetMapping("/list")
    public void list(PageRequestDTO pageRequestDTO, Model model) {

        log.info("list............." + pageRequestDTO);

        model.addAttribute("result", service.getList(pageRequestDTO));

    }
}
```

<br>

GuestbookController에서 list()에는 파라미터로 PageRequestDTO를 이용한다. 스프링 MVC는 파라미터를 자동으로 수집해 주는 기능이 있으므로, 화면에서 page와 size라는 파라미터를 전달하면 PageRequestDTO 객체로 자동으로 수집된다. Model은 결과 데이터를 화면에 전달하기 위해서 사용하고 있다.

<br>

list()에는 Model을 이용해서 GuestbookServiceImpl에서 반환하는 PageResultDTO를 'result'라는 이름으로 전달한다. 실제 내용을 출력하는 list.html에서는 부트스트랩의 테이블 구조를 이용해서 출력한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-04-15-12-20.png)

<br>

**list.html**

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
  <th:block th:replace="~{/layout/basic :: setContent(~{this::content} )}">
    <th:block th:fragment="content">
      <h1 class="mt-4">GuestBook List Page</h1>
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Writer</th>
            <th scope="col">Regdate</th>
          </tr>
        </thead>
        <tbody>
          <tr th:each="dto : ${result.dtoList}">
            <th scope="row">[[${dto.mno}]]</th>
            <td>[[${dto.title}]]</td>
            <td>[[${dto.writer}]]</td>
            <td>[[${#temporals.format(dto.regDate, 'yyyy/MM/dd')}]]</td>
          </tr>
        </tbody>
      </table>
    </th:block>
  </th:block>
</html>
```

<br>

앱을 실행해서 해당 뷰를 확인해 본다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-04-15-26-34.png)

<br>

브라우저에 정상적으로 데이터가 출력되는 것을 확인 했다면 다음 작업은 정상적으로 페이지 이동이 동작하는지 확인하고 화면 아래쪽에 페이지 처리와 클릭 시 페이지의 이동을 처리하는 것이다.

- /guestbook/list 혹은 /guestbook/list?page=1의 경우 아래와 같이 1페이지가 출력된다.
- /guestbook/list?page=2와 같이 페이지 번호를 변경하면 해당 페이지가 나온다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-04-15-30-50.png)

<br>

list.html에는 아래와 같은 코드를 이용해서 화면에 페이지가 출력되도록 조정합니다.

**list.html 일부**

```html
</tbody>
        </table>

        <ul class="pagination h-100 justify-content-center align-items-center">

            <li class="page-item " th:if="${result.prev}">
                <a class="page-link" href="#" tabindex="-1">Previous</a>
            </li>

            <li th:class=" 'page-item ' + ${result.page == page?'active':''} " th:each="page: ${result.pageList}">
                <a class="page-link" href="#">[[${page}]]</a>
            </li>

            <li class="page-item" th:if="${result.next}">
                <a class="page-link" href="#">Next</a>
            </li>

        </ul>


    </th:block>

</th:block>
```

<br>

> #### **line 6:** prev 값이 true이기 때문에 표시된다. <br>
>
> #### **line 10:** result.page는 현재 페이지를 의미한다. 즉 PageResultDTO 클래스의 page 변수이며 == page의 page는 url에서 넘겨준 page 파라미터이다. 지금 each로 각각 페이지를 순회하고 있는데 url에서 넘겨준 page파라미터와 pageList를 순회했을 때 그것과 같으면 해당 페이지를 line 11에서 보여준다<br>
>
> #### **line 11:** [[${page}]]는 th:each="page : 의 page이고 [[]] 는 인라인 표시이다. <br>

<br>

페이지의 '이전(previous)'과 '다음(next)' 부분은 Thymeleaf의 if를 이용해서 처리하고, 페이지 중간에 현재 페이지 여부를 체크해서 'active'라는 이름의 클래스가 출력되도록 작성한다. 브라우저로 확인하면 아래와 같은 페이지 번호들이 출력되는 것을 확인할 수 있다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-04-16-09-19.png)

<br>

아직 링크나 이벤트 처리가 없는 상태이므로 페이지 번호를 이동하기 위해서는 브라우저의 주소창에서 page 파라미터 값을 변경해야만 가능하다. 예를 들어 '/guestbook/list?page=13'과 같이 주소창을 수정하면 다음과 같이 페이지 처리가 되는 결과를 볼 수 있다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-04-16-10-38.png)

<br>

Thymeleaf를 이용하는 경우에는 링크 처리가 좀 더 수월한 편이므로 위의 코드에서 직접 링크를 th:href를 이용해서 아래와 같이 작성한다.

**list.html의 일부**

```html
</tbody>
        </table>

        <ul class="pagination h-100 justify-content-center align-items-center">

            <li class="page-item " th:if="${result.prev}">
                <a class="page-link" th:href="@{/guestbook/list(page= ${result.start -1})}"
                 tabindex="-1">Previous</a>
            </li>

            <li th:class=" 'page-item ' + ${result.page == page?'active':''} "
            th:each="page: ${result.pageList}">
                <a class="page-link" th:href="@{/guestbook/list(page = ${page})}">
                    [[${page}]]
                </a>
            </li>

            <li class="page-item" th:if="${result.next}">
                <a class="page-link"
                th:href="@{/guestbook/list(page= ${result.end + 1})}">Next</a>
            </li>

        </ul>


    </th:block>

</th:block>
```

<br>

> #### **line 7:** Thymeleaf의 th:href은 파라미터를 추가하기 위해서 ()를 추가하고 파라미터의 이름과 값을 적어준다. 즉 (page=$~)의 page는 url에 page 파라미터를 의미한다. <br>
>
> #### **line 13:** th:each에서 페이지를 하나씩 순회하면서 출력하는데 페이지 링크 중 하나를 클릭하면 해당 페이지가 page 파라미터 값으로 설정된다. 아래 사진을 참고한다. <br>

<br>

옆에 <li class="~"> 가 th:each로 인해 생기는 것을 볼 수 있다. 해당 링크를 클릭하면 url의 page 파라미터에 값이 설정되서 해당 페이지로 이동되는 것이다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-04-16-34-20.png)

<br>

만일 링크 처리 시에 (page={page}, size=${result.size})와 같은 내용을 추가한다면 10개가 아닌 원하는 수만큼의 목록을 조회할 수 있다.

---

다음 게시물에서는 등록 페이지와 등록 처리에 대해서 알아보자
