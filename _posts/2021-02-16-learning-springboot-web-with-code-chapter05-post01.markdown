---
layout: post
title: 코드로 배우는 스프링 부트 웹 프로젝트-Part3-01
date: 2021-02-15 19:00:00 0000
tags: [Intellij, SpringBoot]
categories: [SpringBoot]
description: 게시판 만들기
---

<br><br>

# <N:1(다대일) 연관관계> Board 만들기
<br><br>
**_현 게시물은 '코드로 배우는 스프링부트 웹 프로젝트' 라는 서적을 공부하면서 개인적으로 메모하고 공부하기 위해서 작성하는 글입니다._**
---

여기서는 '회원'과 '게시글' 그리고 '댓글'이라는 주제로 JPA에서 연관관계를 가장 쉽게 적용할 수 있는 방법을 알아본다.
먼저 연관관계와 관계형 데이터베이스 설계를 해야 한다. :disappointed:

<br>

'회원'과 '게시글'의 관계를 다음과 같은 명제로 나타내본다.

- 한 명의 회원은 여러 게시글을 작성할 수 있다.
- 하나의 게시글은 한 명의 회원에 의해서 작성된다.

<br>

아래 사진을 보면 회원 데이터의 아이디는 PK에 해당한다. 아이디는 회원을 구분할 수 있는 고유한 값을 가지게 되는 것이다.
게시글 데이터를 보면 작성자 칼럼 값으로 동일한 회원 아이디가 여러 번 나오는 것을 볼 수 있다. 회원 데이터의 입장에서는 하나(One)의 PK(아이디)가 여러(Many) 게시글에서 참조(FK)되고 있는 관계가 된다.

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-16-21-00-46.png)

회원 데이터 쪽이 '일(one)'이고, 게시글 데이터는 동일한 회원 아이디가 여러 번 나오고 있으므로 '다(many)'로 판단하고 다음과 같이 ERD를 작성한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-16-21-05-42.png)

**데이터베이스에서 관계를 해석할 때는 항상 PK 쪽에서 해석하고, 이를 반영해야 혼란을 줄일 수 있다** :open_mouth:

<br>

즉, 앞에서 이야기했던 두 명제는 다음과 같이 해석되어야 한다.

- 한 명의 회원은 여러 개의 게시글을 작성할 수 있다(PK에서 해석)
- 하나의 게시글은 한 명의 작성자만을 표시할 수 있다.

<br>

이제 '회원, 게시글, 댓글'의 관계를 PK를 기준으로 설계해보면 다음과 같은 구조가 된다.

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-16-21-17-05.png)

회원이 있어야 게시글을 작성할 수 있으므로 회원 테이블을 먼저 설계하고 게시글을 작성할 때는 특정 회원과의 관계를 설정해 주어야 한다. 댓글은 게시글이 있어야만 작성할 수 있으므로 게시글을 우선 설계하고, 댓글 테이블이 게시글을 FK로 작성한다.

<br>

JPA는 객체지향의 입장에서 관계를 보는데 간단한 시작은 객체지향보다는 관계형 데이터베이스 모델링을 위주로 해서 구성하는 것이 편리하다.
:thumbsup:

---

<br>

## **예제 프로젝트의 생성**

<br><br>

프로젝트의 생성은 'board'라는 이름의 프로젝트로 생성하고 Gradle, War 항목을 선택한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-16-21-23-58.png)

<br>

추가할 라이브러리는 'Spring Boot DevTools, Lombok, Spring Web, Thymeleaf, Spring Data JPA 등을 추가한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-16-21-24-30.png)

<br>

MariaDB JDBC 드라이버와 Thymeleaf의 시간 처리 관련 라이브러리를 추가한다.

_"나는 mysql를 선호해서 mysql connector로 대신했다"_ :satisfied:

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-16-21-26-35.png)

<br>

application.properties 파일에는 JPA 관련 설정을 추가한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-16-21-29-06.png)

<br>

프로젝트 내에 entity 패키지를 생성하고, 이전 예제에서 사용했던 BaseEntity 클래스를 추가한다. 그리고 미리 dto와 controller 패키지를 추가해 놓는다.

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-17-18-12-05.png)

<br>

**BaseEntity 클래스**

```java
package org.zerock.board.entity;

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
abstract class BaseEntity {
    @CreatedDate
    @Column(name="regdate",updatable=false)
    private LocalDateTime regDate;

    @LastModifiedDate
    @Column(name="moddate")
    private LocalDateTime modDate;
}

```

BoardApplication에는 @EnalbeJpaAuditing을 추가한다.

<br>

**BoardApplication 클래스**

```java
package org.zerock.board;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class BoardApplication {

    public static void main(String[] args) {
        SpringApplication.run(BoardApplication.class, args);
    }

}

```

연관관계의 설정은 처음부터 설정하는 방식 보다는 엔티티 클래스들을 구성한 이후에 각 엔티티 클래스의 연관관계를 고민해서 설정하는 것이 더 수월하다.
entity 패키지에 Member(회원), Board(게시물), Reply(댓글) 엔티티 클래스를 추가한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-17-18-23-25.png)

회원 엔티티 클래스는 최근에 많이 사용하는 이메일(email)을 사용자의 아이디 대신에 사용한다.

<br>

**Member 클래스**

```java
package org.zerock.board.entity;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public class Member extends BaseEntity{
    @Id
    private String email;
    private String password;
    private String name;
}

```

Member 클래스는 이메일 주소를 PK로 사용한다. 따로 FK를 사용하진 않는다. 그래서 별도의 참조가 필요가 없다.

Board 클래스는 Member의 이메일(PK)을 FK로 참조하는 구조이다.

<br>

**Board 클래스**

```java
package org.zerock.board.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString(exclude = "writer")
public class Board extends BaseEntity{
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long bno;
    private String title;
    private String content;
}

```

Reply 클래스는 회원이 아닌 사람도 댓글을 남길 수 있다고 가정하고 Board와 연관관계를 맺지 않은 상태로 처리한다.

<br>

**Reply 클래스**

```java
package org.zerock.board.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString(exclude = "board")
public class Reply extends BaseEntity{
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long rno;
    private String text;
    private String replyer;
}

```

데이터베이스 구조로 보면 앞으로 생성될 board 테이블과 member 테이블에는 FK를 이용한 참조가 걸려 있게 된다. member 쪽의 email을 board에서는 FK로 참조하는 구조이다.

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-17-19-00-48.png)


board와 member 관계는 N:1(다대일)의 관계가 되므로 JPA에서는 이를 의미하는 @ManyToOne을 적용한다.

_**@ManyToOne은 데이터베이스상에서 외래키의 관계로 연결된 엔티티 클래스에 설정한다.**_

보면 member 엔티티의 PK가 email이니까 board 클래스에서 저렇게 Member writer 위에 어노테이션으로 @ManyToOne를 해주면 자동으로 email과 연관된 FK가 생성되는 것이다.

<br>

**Board 클래스의 변경**

```java
package org.zerock.board.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString(exclude = "writer")
public class Board extends BaseEntity{
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long bno;
    private String title;
    private String content;
    @ManyToOne
    private Member writer;
}
```
Reply 쪽에서는 Board 쪽의 PK를 참조해서 구성되어야 하므로 아래와 같이 수정한다.

<br>

**Reply 클래스 변경**
```java
package org.zerock.board.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString(exclude = "board")
public class Reply extends BaseEntity{
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long rno;
    private String text;
    private String replyer;
    @ManyToOne(fetch=FetchType.LAZY)
    private Board board;
}

```

<br>

프로그램을 실행해서 테이블과 연관관계가 정상적으로 만들어졌는지 확인을 한다.
테이블이 정상적으로 생성되었다면 각 엔티티에 맞는 Repository 인터페이스를 추가한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-17-19-15-47.png)

<br>

**MemberRepository 인터페이스**
```java
package org.zerock.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.board.entity.Member;

public interface MemberRepository extends JpaRepository<Member, String> {
}

```

<br>

**BoardRepository 인터페이스**
```java
package org.zerock.board.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.board.entity.Board;
import org.zerock.board.repository.search.SearchBoardRepository;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {
}

```

<br>

**ReplyRepository 인터페이스**
```java
package org.zerock.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.zerock.board.entity.Board;
import org.zerock.board.entity.Reply;

import java.util.List;

public interface ReplyRepository extends JpaRepository<Reply, Long> {
}

```

<br>

---

To be Continued...