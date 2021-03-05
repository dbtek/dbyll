---
layout: post
title: 코드로 배우는 스프링 부트 웹 프로젝트-Part2-01
date: 2021-03-02 16:00:00 0000
tags: [Intellij, SpringBoot, Guesbook]
categories: [SpringBoot]
description: 방명록 만들기
---

<br><br>

# <center>페이지 처리되는 영화별 평균 점수/리뷰 개수 구하기</center>

<br>

_해당 내용은 책 '코드로 배우는 스프링부트 웹 프로젝트'의 내용이며 이 게시물은 그 책을 개인적으로 공부하며 메모해 두기 위해서 쓰는 것임을 알려드립니다_

<br><br>

이번 방명록 만들기 프로젝트를 통해서 다음과 같은 내용을 학습한다.

- 프로젝트의 계층별 구조와 객체들의 구성
- Querydsl을 이용해서 동적으로 검색 조건을 처리하는 방법
- Entity 객체와 DTO의 구분
- 화면에서의 페이징 처리

<br>

웹 프로젝트를 구성할 때는 가장 먼저 와이어프레임(화면 설계서)을 제작하고 진행하는 것이 좋다. 와이어프레임을 제작하면 화면의 URI와 전달되는 파라미터 등을 미리 결정할 수 있고 데이터베이스 설계에 필요한 칼럼들을 미리 파악하는데도 도움이 된다.

**화면 개발의 목표**

- 목록 화면 (번호 1) - 전체 목록을 페이징 처리해서 조회할 수 있고, 제목/내용/작성자 항목으로 검색과 페이징 처리를 가능하게 한다.
- 등록 화면(번호 2) - 새로운 글을 등록할 수 있고, 등록 처리 후 다시 목록 화면으로 이동하게 된다.
- 조회 화면(번호 3) - 목록 화면에서 특정한 글을 선택하면 자동으로 조회 화면으로 이동한다. 조회 화면에서는 수정/삭제가 가능한 화면(번호 4)으로 버튼을 클릭해서 이동할 수 있다.
- 수정/삭제 화면(번호 4) - 수정 화면에서 삭제가 가능하고 삭제 후에는 목록 페이지로 이동한다. 글을 수정하는 경우에는 다시 조회 화면(번호 2)으로 이동해서 수정된 내용을 확인할 수 있다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-02-17-06-40.png)

<br>

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-02-17-16-17.png)

<br>

프로젝트의 기본 구조는 아래 사진과 같다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-02-17-16-47.png)

<br>

- 브라우저에서 들어오는 Request는 GuestbookController라는 객체로 처리한다.
- GuestbookController는 GuestbookService 타입을 주입받는 구조로 만들고, 이를 이용해서 원하는 작업을 처리한다.
- GuestbookRepository는 Spring Data JPA를 이용해서 구성하고, GuestbookServiceImpl 클래스에 주입해서 사용한다.
- 마지막 결과는 Thymeleaf를 이용해서 레이아웃 템플릿을 활용해서 처리한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-02-17-21-10.png)

<br>

- 브라우저에서 전달되는 Reqeust는 GuestbookController에서 DTO의 형태로 처리된다.
- GuestbookRepository는 엔티티 타입을 이용하므로 중간에 Service 계층에서는 DTO와 엔티티의 변환을 처리한다.

자 이제 프로젝트를 생성해 보자.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-02-17-23-19.png)

<br>

의존성으로는

- Spring Boot DevTools
- Lombok
- Spring Web
- Thymeleaf
- Spring Data JPA

를 체크한다.

![](../images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-02-17-23-58.png)

<br>

이제 데이터베이스 관련 드라이버 추가를 할 차례이다. 책에서는 MariaDB관련 JDBC 드라이버를 추가했지만 나는 MySql 관련 JDBC 드라이버를 추가한다. 그리고 Thymeleaf에서 사용하게 될 java8 날짜 관련 라이브러리도 추가한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-02-17-30-27.png)

<br>

**build.gradle**

```gradle
    compile group: 'org.thymeleaf.extras', name: 'thymeleaf-extras-java8time'
    compile group: 'mysql', name: 'mysql-connector-java', version: '8.0.22'
```

<br>

그리고 데이터베이스 관련 설정도 추가한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-02-17-30-49.png)

<br>

**application.properties**

```
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/bootex?serverTimezone=UTC&characterEncoding=UTF-8
spring.datasource.username=bootex
spring.datasource.password=bootex

spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.show-sql=true

spring.thymeleaf.cache=false

```

<br>

컨트롤러/화면 관련 준비는 이전 장에서 작성해 둔 layout 폴더를 그대로 사용한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-02-17-32-56.png)

<br>

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-02-17-33-03.png)

<br>

**GuestbookController.java**

```java
package org.techlead.guestbook.controller;

import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping("/guestbook")
@Log4j2
public class GuestbookController {
    @GetMapping({"/","/list"})
    public String index() {
        log.info("list......");
        return "/guestbook/list";
    }


}
```

<br>

> #### **line 16:** 리턴으로 html의 경로를 반환하고 있다 즉 template/guestbook 아래에 있는 list.html를 보여줄 것이다. 만약 문자열을 반환하지 않는다면 @GetMapping 어노테이션의 디폴트 기능으로서 그 어노테이션 안에 문자열에 해당하는 html이 있는지 찾고 있으면 저절로 매핑해줄 것이다.<br>

컨트롤러가 제대로 작동하는지 보기 위해 일단 list.html은 layout 폴더의 basic.html을 이용하는 구조로 작성하고 간단한 텍스트를 출력하는 내용으로 작성한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-02-17-38-23.png)

<br>

**list.html**

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
  <th:block th:replace="~{/layout/basic :: setContent(~{this::content} )}">
    <th:block th:fragment="content">
      <h1>Guestbook List Page</h1>
    </th:block>
  </th:block>
</html>
```

<br>

> #### **line 4:** /layout아래 basic.html에 fragment로 선언되어 있는 것 중 이름이 "setContent()"인 부분으로 replace한다. 그리고 this::content를 파라미터로 넘겨주고 있다. 즉 list.html 안에 fragment 이름이 "content"인 부분을 넘겨준다. basic.html은 어떤 틀마냥 템플릿처럼 작용하고 그 틀 안의 내용을 list.html의 content부분으로 채운다고 생각하면 쉽다.<br>

자 이제 앱을 실행해 보자. http://localhost:8080/guestbook/으로 접속하거나 http://localhost:8080/guestbook/list 로 접속해도 똑같은 뷰가 보인다. 이유는 앞에 Controller에서 @GetMapping 어노테이션 안에 "/" 이것과 "list" 두 개를 넣어줬기 때문이다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-02-17-49-01.png)

<br>

데이터를 등록과 수정 시간이 자동으로 추가되고 변경되어야 하는 컬럼들이 있는데 이를 일일이 처리하면 번거롭기 때문에 자동으로 처리할 수 있도록 어노테이션을 이용해서 설정하면 편하다. 프로젝트 내에 entity 패키지를 생성하고 엔티티 객체의 등록 시간과 최종 수정 시간을 담당하게 될 BaseEntity 클래스를 추상 클래스로 작성한다.

**BaseEntity.java**

```java
package org.techlead.guestbook.entity;

import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

@MappedSuperclass
@EntityListeners(value={AuditingEntityListener.class})
@Getter
abstract public class BaseEntity {
    @CreatedDate
    @Column(name="regdate", updatable=false)
    private LocalDateTime regDate;

    @LastModifiedDate
    @Column(name="moddate")
    private LocalDateTime modDate;
}

```

<br>

> #### **line 13:** @MappedSuperclass라는 특별한 어노테이션은 적용된 클래스는 테이블로 생성되지 않는다. 실제 테이블은 BaseEntity 클래스를 상속한 엔티티의 클래스로 데이터베이스 테이블이 생성된다.<br>
>
> #### **line 17:** @CreatedDate는 JPA에서 엔티티의 생성 시간을 처리한다.<br>
>
> #### **line 21:** @LastModifiedDate는 최종 수정 시간을 자동으로 처리하는 용도로 사용한다.<br>
>
> #### **line 18:** updatable=false를 통해서 해당 엔티티 객체를 데이터베이스에 반영할 때 regdate 칼럼값은 변경되지 않는다.<br>

추가적으로 JPA를 이용하면서 AuditionEntityListener를 활성화시키기 위해서는 프로젝트에 @EnableJpaAuditing 설정을 추가 해야 한다.

\*\*GuestbookApplication.java

```java
package org.techlead.guestbook;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class GuestbookApplication {

    public static void main(String[] args) {
        SpringApplication.run(GuestbookApplication.class, args);
    }

}

```

<br>

이제 새로운 엔티티 클래스인 Guestbook를 추가한다. 그리고 코드를 추가하자.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-03-12-49-08.png)

<br>

**Guestbook.java**

```java
package org.techlead.guestbook.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Guestbook extends BaseEntity{
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long gno;

    @Column(length=100, nullable=false)
    private String title;

    @Column(length=1500, nullable=false)
    private String content;

    @Column(length=50,nullable=false)
    private String writer;

}

```

<br>

위 코드를 보면 BaseEntity를 상속하고 있는 것을 볼 수 있다. 이렇게 BaseEntity를 상속하게 되면 Guestbook 테이블에 우리가 선언 했던 moddate와 regdate 필드가 생기게 된다. 그리고 리스너로 인해서 자동으로 생성 날짜와 수정 날짜가 설정된다.

엔티티 클래스를 만들었으니 이제 새로운 패키지를 추가하고 GuestbookRepository 인터페이스를 작성한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-03-12-52-37.png)

<br>

**GuestbookRepository 인터페이스**

```java
package org.techlead.guestbook.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.techlead.guestbook.entity.Guestbook;

public interface GuestbookRepository extends JpaRepository<Guestbook, Long>{
}
```

<br>

JPA의 쿼리 메서드의 기능과 @Query를 통해서 많은 기능을 구현할 수 있지만 선언할 때 고정된 형태의 값을 가진다는 단점이 있다. 그래서 복잡한 조합을 이용하는 경우의 수가 많은 상황에서는 동적으로 쿼리를 생성해서 처리할 수 있는 기능이 필요하다. Querydsl은 이러한 상황을 처리할 수 있다. 이것을 이용하면 조인, 서브 쿼리 등의 기능도 구현이 가능하다.

Querydsl은 엔티티 클래스를 그대로 이용하는 것이 아닌 'Q도메인'이라는 것을 이용해야 한다.

build.gradle 파일에 다음과 같은 내용을 처리한다

- plugins 항목에 querydsl 관련 부분 추가
- dependencies 항목에 필요한 라이브러리를 추가
- Gradle에서 사용할 추가적인 task를 추가

<br>

**build.gradle plugin 추가**
![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-03-13-01-51.png)

<br>

**build.gradle dependencies 추가**
![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-03-13-02-23.png)

<br>

**build.gralde task 생성**
![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-03-13-03-28.png)

<br>

이렇게 추가가 다 끝나고 build.gradle 파일이 갱신되면 아래 사진과 같이 compileQuerydsl이라는 실행 가능한 task가 추가된 것을 확인할 수 있다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-03-13-05-32.png)

<br>

이것을 실행하면 프로젝트 내 build 폴더 안에 다음과 같은 구조가 생성된다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-03-13-06-26.png)

<br>

Querydsl을 이용하게 되면 GuestbookRepository 인터페이스 역시 QuerydslPredicateExecutor라는 인터페이스를 추가로 상속한다.

이제 Querydsl 위주의 예제로 다른 개발 전에 테스트를 진행해 보자. test 폴더 내에 repository 패키지를 생성하고 GuestbookRepositoryTests 클래스를 추가한다.

**GuestbookRepositoryTests.java**

```java
package org.techlead.guestbook.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.techlead.guestbook.entity.Guestbook;
import java.util.stream.IntStream;

@SpringBootTest
public class GuestbookRepositoryTests {

    @Autowired
    private GuestbookRepository guestbookRepository;

    @Test
    public void insertDummies() {

        IntStream.rangeClosed(1, 300).forEach(i -> {

            Guestbook guestbook = Guestbook.builder()
                    .title("Title...." + i)
                    .content("Content..." + i)
                    .writer("user" + (i % 10))
                    .build();
            System.out.println(guestbookRepository.save(guestbook));
        });
    }
}
```

<br>

그리고 테스트를 실행하면 mysql에 데이터가 정상적으로 들어가는 것을 볼 수 있다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-03-13-17-12.png)

<br>

엔티티 클래스는 가능하면 setter 관련 기능을 만들지 않는 것이 권장 사항이다. 필요에 따라 수정 기능을 만들기도 하지만 엔티티 객체가 애플리케이션 내부에서 변경되면 JPA를 관리하는 쪽이 복잡해질 우려가 있기 때무넹 가능하면 최소한의 수정이 가능하도록 하는 것을 권장한다.

예제로 작성 중인 방명록은 현실적으로는 수정 기능이 없어도 무방하지만 예제에서는 제목(title)과 내용(content)을 수정할 수 있도록 changeTitle(), changeContent()와 같은 메서드를 추가하도록 Guestbook 클래스를 수정한다.

**Guestbook.java**

```java
(...)
@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Guestbook extends BaseEntity{
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long gno;

    @Column(length=100, nullable=false)
    private String title;

    @Column(length=1500, nullable=false)
    private String content;

    @Column(length=50,nullable=false)
    private String writer;

    public void changeTitle(String title){
        this.title=title;
    }
    public void changeContent(String content){
        this.content=content;
    }

}
```

<br>

본격적으로 Querydsl 실습을 해보자.

- '제목/내용/작성자'와 같이 단 하나의 항목으로 검색하는 경우
- '제목+내용'/'내용+작성자'/'제목+작성자'와 같이 2개의 항목으로 검색하는 경우
- '제목+내용+작성자'와 같이 3개의 항목으로 검색하는 경우

<br>

만일 Guestbook 엔티티 클래스에 많은 멤버 변수들이 선언되어 있었다면 이러한 조합의 수는 엄청 많아지게 된다. 이런 상황을 대비해서 상황에 맞게 쿼리를 처리할 수 있는 Querydsl이 필요하다.

Querydsl의 사용법은 다음과 같다.

- BooleanBuilder를 생성한다.
- 조건에 맞는 구문은 Querydsl에서 사용하는 Predicate 타입의 함수를 생성한다.
- BooleanBuilder에 작성된 Predicate를 추가하고 실행한다.

<br>

예제로 '제목(title)'에 '1'이라는 글자가 있는 엔티티들을 검색해보면 다음과 같이 작성할 수 있다.

**GuestRepositoryTests.java**

```java
(...)
  @Autowired
    private GuestbookRepository guestbookRepository;
    @Test
    public void insertDummies(){

        IntStream.rangeClosed(1,300).forEach(i -> {

            Guestbook guestbook = Guestbook.builder()
                    .title("Title...." + i)
                    .content("Content..." +i)
                    .writer("user" + (i % 10))
                    .build();
            System.out.println(guestbookRepository.save(guestbook));
        });
    }

    @Test
    public void testQuery1() {

        Pageable pageable = PageRequest.of(0, 10, Sort.by("gno").descending());

        QGuestbook qGuestbook = QGuestbook.guestbook; //1

        String keyword = "1";

        BooleanBuilder builder = new BooleanBuilder();  //2

        BooleanExpression expression = qGuestbook.title.contains(keyword); //3

        builder.and(expression); //4

        Page<Guestbook> result = guestbookRepository.findAll(builder, pageable); //5

        result.stream().forEach(guestbook -> {
            System.out.println(guestbook);
        });
    }
}
```

<br>

> #### **line 23:** 가장 먼저 동적으로 처리하기 위해서 Q도메인 클래스를 얻어온다. Q도메인 클래스를 이용하면 엔티티 클래스에 선언된 title, content 같은 필드들을 변수로 활용할 수 있다.<br>
>
> #### **line 27:** BooleanBuilder는 where문에 들어가는 조건들을 넣어주는 컨테이너라고 간주한다.<br>
>
> #### **line 29:** 원하는 조건은 필드 값과 같이 결합해서 생성한다. BooleanBuilder 안에 들어가는 값은 com.querydsl.core.types.Predicate 타입이어야 한다(Java에 있는 Predicate 타입이 아니므로 주의한다)<br>
>
> #### **line 31:** 만들어진 조건은 where문제 and나 or같은 키워드와 결합시킵니다.<br>
>
> #### **line 33:** BooleanBuilder는 GuestbookRepository에 추가된 QuerydslPredicateExcutor 인터페이스의 findAll()을 사용할 수 있다.<br>

<br>

테스트 코드를 실행한 후 결과는 아래 사진과 같다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-03-13-58-12.png)

<br>

이제 다중 항목 검색 테스트를 해본다. 복합 조건은 여러 조건이 결합한 형태를 말한다. 예를 들어 '제목(title) 혹은 내용(content)'에 특정한 키워드(keyword)가 있고 'gno가 0보다 크다'와 같은 조건을 처리해 보도록 한다. BooleanBuilder는 and() 혹은 or()의 파라미터로 BooleanBuilder를 전달할 수 있어서 복합적인 쿼리를 생성할 수 있다. 테스트 코드를 통해서

**'제목 혹은 내용에 특정한 키워드가 있고, gno가 0보다 크다'** 라는 조건을 처리해 본다.

**GuestbookRepositoryTests.java 일부**

```java
  @Test
    public void testQuery2(){
        Pageable pageable=PageRequest.of(0,10,Sort.by("gno").descending());
        QGuestbook qGuestbook=QGuestbook.guestbook;
        String keyword="1";
        BooleanBuilder builder=new BooleanBuilder();
        BooleanExpression exTitle=qGuestbook.title.contains(keyword);
        BooleanExpression exContent=qGuestbook.content.contains(keyword);
        BooleanExpression exAll=exTitle.or(exContent);
        builder.and(exAll);
        builder.and(qGuestbook.gno.gt(0L));
        Page<Guestbook> result=guestbookRepository.findAll(builder,pageable);
        result.stream().forEach(guestbook->{
            System.out.println(guestbook);
        });
    }
```

<br>

> #### **line 5:** 키워드 1 지정 <br>
>
> #### **line 9:** 키워드를 가지고 있는 title 혹은 내용 이라는 조건을 exAll 변수에 저장<br>
>
> #### **line 10:** exAll 조건을 builder에 추가<br>
>
> #### **line 11:** gno가 0보다 커야 한다는 조건을 builder에 추가<br>

<br>

테스트 코드를 실행하면 결과는 아래 사진과 같다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-03-14-21-56.png)

<br>

만일 '제목+내용+작성자' 부분을 처리하고 싶다면 동일하게 BooleanExpression을 생성하고 or 조건으로 결합하면 된다.

---

다음 게시물에서는 서비스 계층과 DTO를 만들어본다.
