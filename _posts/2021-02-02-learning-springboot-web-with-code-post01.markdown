---
layout: post
title: 코드로 배우는 스프링 부트 웹 프로젝트-Part4-01
date: 2021-02-02 14:00:00 0000
tags: [Intellij, SpringBoot]
categories: [SpringBoot]
description: 영화 리뷰 만들기
---

<br><br>

# <center>Part 4-M:N(다대다) 관계와 파일 업로드 처리</center>

<br><br>
**_현 게시물은 '코드로 배우는 스프링부트 웹 프로젝트' 라는 서적을 공부하면서 개인적으로 메모하고 공부하기 위해서 작성하는 글입니다._**

---

# M:N(다대다) 관계의 설계와 구현

- 영화(Movie)와 회원(Member)이 존재하고 회원이 영화에 대한 평점과 감상을 기록하는 시나리오를 기반으로 프로젝트 구성

> 명제
>
> > 1.  한 편의 영화는 여러 회원의 평가가 행해질 수 있다.
> > 2.  한 명의 회원은 여러 영화에 대해서 평점을 줄 수 있다.
> >     > 영화와 회원은 양쪽 모두 독립적인 엔티티로 설계 가능
> >     > 회원의 입장에서 보면 여러 편의 영화를 평가함
> >     > 영화와 회원은 다대다 관계가 형성됨

- M:N (다대다)을 해결하기 위해서는 실제 테이블 설계에서는 매핑(mapping) 테이블을 사용함
- 매핑 테이블은 흔희 '연결 테이블' 이라고 부름
  - 말 그대로 두 테이블의 중간에서 필요한 정보를 양쪽에서 끌어다 쓰는 구조

![erm](........\images\Learning_SpringBoot_with_Web_Project\Part4\Chapter7\ERM.PNG)
<br><br><br>

- 매핑 테이블의 작성 이전에 다른 테이블들이 먼저 존재해야 함
- 매핑 테이블은 주로 '명사'가 아닌 '동사'나 '히스토리'에 대한 데이터를 보관하는 용도로 씀
- 매핑 테이블은 중간에서 양쪽의 PK를 참조하는 형태로 사용

<br>
### 양방향 참조의 위험성
- JPA의 실행에서 가장 중요한 것이 현재 메모리상의 엔티티 객체들의 상태와 데이터베이스의 상태를 동기화시키는 것이라는 점을 생각해 보면 하나의 객체를 수정하는 경우에 다른 객체의 상태를 매번 일치하도록 변경하는 작업이 간단치 않음

**'당방향 참조'를 위주로 프로젝트를 진행하는 이유는 연관된 객체들이 많은 경우에 상태를 정확히 유지하는 것이 어렵기 때문이다.**

### 프로젝트 생성

![create](........\images\Learning_SpringBoot_with_Web_Project\Part4\Chapter7\create.PNG)
<br><br><br>

![dependencies](........\images\Learning_SpringBoot_with_Web_Project\Part4\Chapter7\dependencies.PNG)
<br><br><br>

### build.gradle

책에서는 mariaDB를 썼지만 나는 mysql workbench를 쓸 것임으로 mysql connector를 사용한다.

```java
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    compileOnly 'org.projectlombok:lombok'
    developmentOnly 'org.springframework.boot:spring-boot-devtools'
    annotationProcessor 'org.projectlombok:lombok'
    providedRuntime 'org.springframework.boot:spring-boot-starter-tomcat'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    compile group: 'mysql', name: 'mysql-connector-java', version: '8.0.22'
    compile group: 'org.thymeleaf.extras', name: 'thymeleaf-extras-java8time'
}
```

<br><Br>

### application.properties

```java
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/bootex?serverTimezone=UTC&characterEncoding=UTF-8
spring.datasource.username=bootex
spring.datasource.password=bootex

spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.show-sql=true

spring.thymeleaf.cache=false
```

<br><br>

### 엔티티 설계

![main](........\images\Learning_SpringBoot_with_Web_Project\Part4\Chapter7\main.PNG)
<br><br><br>

**MreviewApplication 클래스 일부**

```java
@SpringBootApplication
@EnableJpaAuditing
public class MreviewApplication {

    public static void main(String[] args) {
        SpringApplication.run(MreviewApplication.class, args);
    }

}
```

<Br><br>
![Movie](........\images\Learning_SpringBoot_with_Web_Project\Part4\Chapter7\Movie.PNG)
<br><br><br>

**Movie 클래스**

```java
package org.zerock.mreview.entity;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public class Movie extends BaseEntity{
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long mno;
    private String title;
}

```

<br><br>

### MovieImage 클래스

- MovieImage 클래스는 단방향 참조로 처리할 것이고 @Query로 'left join' 등을 사용하게 됨
  - 이러한 작업을 할 때는 JPQL에서 엔티티 클래스인 경우에 사용이 자유로움

**MovieImage 클래스**

```java
package org.zerock.mreview.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@ToString(exclude="movie")
public class MovieImage {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long inum;

    private String uuid;
    private String imgName;
    private String path;
    @ManyToOne(fetch= FetchType.LAZY)
    private Movie movie;
}

```

- MovieImage 클래스에는 나중에 사용할 이미젱 대한 정보를 기록
- java.util.UUID를 이용하여 고유한 번호 생성
- 잠시 뒤에 테이블로 생성될 때는 movie 테이블이 PK를 가지고, movie_image 테이블은 FK를 가지게 되므로 @ManyToOne을 적용해서 이를 표시
  <br><br>

**Member 클래스**

- Member 클래스는 고유한 번호, 이메일, 아이디와 패스워드, 닉네임을 의미하도록 클래스 설계

![member](........\images\Learning_SpringBoot_with_Web_Project\Part4\Chapter7\member.PNG)
<br>

```java
package org.zerock.mreview.entity;

import lombok.*;
import org.hibernate.annotations.GeneratorType;

import javax.persistence.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
@Table(name="m_member")
public class Member extends BaseEntity{
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long mid;

    private String email;
    private String pw;
    private String nickname;
}

```

<br><br>

##### 이때 @Table 부분에서 Intellij 화면에 에러 메시지처럼 보이기는 하지만 실제로 에러는 아님

<u>해결방법</u>

- File -> Settings -> Editor -> Inspections -> JPA -> Unresolved database references in annotations 항목을 해제하고 'Apply' 한다

### 매핑 테이블을 위한 Review 클래스 설계

- 매핑 테이블은 주로 '동사'나 '히스토리'를 의미하는 테이블을 의미 - 예제에서 '회원이 영화에 대해서 평점을 준다'를 구성할 때 '평점을 준다'는 행위가 바로 매핑 테이블이 필요한 부분 - '회원'이라는 주어와 '영화'라는 목적어가 있지만 이에 대한 '평점을 준다'는 부분이 중간에서 주어와 목적어를 연결하는 매핑 테이블이 담당하게 됨 - @ManyToMany의 경우 관꼐를 설정할 수는 있지만 두 엔티티 간의 추가적인 데이터를 기록할 수는 없음
  <br>

**Review 클래스**
![review](........\images\Learning_SpringBoot_with_Web_Project\Part4\Chapter7\review.PNG)
<br>

```java
package org.zerock.mreview.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString(exclude={"movie", "member"})
public class Review extends BaseEntity{
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long reviewnum;

    @ManyToOne(fetch= FetchType.LAZY)
    private Movie movie;

    @ManyToOne(fetch=FetchType.LAZY)
    private Member member;

    private int grade;

    private String text;
}
```

- Fetch 모드는 모두 LAZY 설정을 이용
- toString() 호출 시에 다른 엔티티를 사용하지 않도록 @ToString에 exclude 속성을 지정

\*\*생성된 테이블 ERD

![ermcomplete](........\images\Learning_SpringBoot_with_Web_Project\Part4\Chapter7\ermcomplete.PNG)
<br><br>

### Repository 생성하기

![repository](........\images\Learning_SpringBoot_with_Web_Project\Part4\Chapter7\repository.PNG)
<br><br>

**MemberRepository 인터페이스**

```java
package org.zerock.mreview.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.mreview.entity.Member;

public interface MemberRepository extends JpaRepository<Member,Long> {
}
```

<br>

**MovieImageRepository**

```java
package org.zerock.mreview.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.mreview.entity.Movie;
import org.zerock.mreview.entity.MovieImage;

public interface MovieImageRepository extends JpaRepository<MovieImage, Long> {
}

```

**ReviewRepository**

```java
package org.zerock.mreview.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.mreview.entity.Review;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

}

```

이 데이터를 이용해서 화면에서 필요한 데이터를 생각해보기

- 목록 화면에서 영화의 제목과 이미지 하나, 영화 리뷰의 평점/리뷰 개수를 출력
- 영화 조회 화면에서 영화와 영화의 이미지들, 리뷰의 평균점수/리뷰 개수를 같이 출력
- 리뷰에 대한 정보에는 회원의 이메일이나 닉네임(nickname)과 같은 정보를 같이 출력

**페이지 처리되는 영화별 평균 점수/리뷰 개수 구하기**

- 목록 화면에서는 영화(Movie)와 영화 이미지(MovieImage), 리뷰의 수, 평점 평균을 화면에 출력하고자 함

![content](........\images\Learning_SpringBoot_with_Web_Project\Part4\Chapter7\content.PNG)
<br><br>

- 영화(movie)와 영화 이미지(movie_image)는 '일대다'의 관계가 됨

리뷰(review)를 같이 조인하면 아래와 같은 구조가 된다.

![structure](........\images\Learning_SpringBoot_with_Web_Project\Part4\Chapter7\structure.PNG)

---

#### 다음 게시물에서는 Spring Data JPA Query를 이용해 본다
