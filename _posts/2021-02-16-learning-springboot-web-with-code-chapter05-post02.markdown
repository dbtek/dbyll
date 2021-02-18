---
layout: post
title: 코드로 배우는 스프링 부트 웹 프로젝트-Part3-02
date: 2021-02-17 19:00:00 0000
tags: [Intellij, SpringBoot]
categories: [SpringBoot]
description: 게시판 만들기
---

<br><br>

# 연관관계 테스트
<br><br>
**_현 게시물은 '코드로 배우는 스프링부트 웹 프로젝트' 라는 서적을 공부하면서 개인적으로 메모하고 공부하기 위해서 작성하는 글입니다._**
---

데이터를 추가하는 작업을 PK 쪽에서부터 시작하는 것이 좋다. 프로젝트를 다음 그림과 같이 구성한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-17-19-16-01.png)

<br>

작성하는 MemberRepositoryTests에는 MemberRepository를 주입하고 예제로 사용할 Member 객체를 100개 추가하는 테스트 코드를 작성한다.

<br>

**MemberRepositoryTests 클래스**
```java
package org.zerock.board.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.zerock.board.entity.Member;

import java.util.stream.IntStream;
@SpringBootTest
public class MemberRepositoryTests {
    @Autowired
    private MemberRepository memberRepository;

    @Test
    public void insertMembers(){
        IntStream.rangeClosed(1,100).forEach(i->{
            Member member=Member.builder()
                    .email("user"+i+"@aaa.com")
                    .password("1111")
                    .name("USER"+i)
                    .build();
            memberRepository.save(member);
        });
    }
}

```
<br>

테스트의 실행 결과로 데이트베이스에 회원 데이터가 추가되었는지 확인한다.

BoardRepositoryTests 코드 역시 동일한 패키지에 추가하고 앞에서 만들어진 회원 데이터를 이용해서 Board 객체를 생성해서 추가하도록 테스트 코드를 작성한다.

<br>

**BoardRepositoryTests 클래스**
```java
package org.zerock.board.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.board.entity.Board;
import org.zerock.board.entity.Member;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

@SpringBootTest
public class BoardRepositoryTests {
    @Autowired
    private BoardRepository boardRepository;
    @Test
    public void insertBoard(){
        IntStream.rangeClosed(1,100).forEach(i->{
            Member member= Member.builder().email("user"+i+"@aaa.com").build();
            Board board=Board.builder()
                    .title("Title..."+i)
                    .content("Content...."+i)
                    .writer(member)
                    .build();
            boardRepository.save(board);
        });
    }
}
```
<br>

testInsert()는 한 명의 사용자가 하나의 게시물을 등록하도록 작성되었다. 테스트 결과는 데이터베이스를 통해 확인한다.

댓글은 ReplyRepositoryTest 클래스를 작성해서 특정한 임의의 게시글을 대상으로 댓글을 추가한다. 현재 게시글은 1번부터 100번까지의 임의의 번호를 이용해서 300개의 댓글을 추가한다.

<br>

**ReplyRepositoryTests 클래스**
```java
package org.zerock.board.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.zerock.board.entity.Board;
import org.zerock.board.entity.Reply;

import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

@SpringBootTest
public class ReplyRepositoryTests {
    @Autowired
    private ReplyRepository replyRepository;

    @Test
    public void insertReply(){
        IntStream.rangeClosed(1,300).forEach(i->{
            long bno=(long)(Math.random()*100)+1;
            Board board= Board.builder().bno(bno).build();

            Reply reply=Reply.builder()
                    .text("Reply......"+i)
                    .board(board)
                    .replyer("guest")
                    .build();
            replyRepository.save(reply);
        });
    }
}
```
insertReply()는 300개의 댓글을 1~100 사이의 번호로 추가한다. 데이터베이스에는 1번부터 100번까지 게시물에 대해서 n개의 댓글이 추가된다.

<br>

데이터 추가가 완료되었다면 이제 화면에 필요한 데이터를 정리해 본다.

- 목록 화면: 게시글의 번호, 제목, 댓글 개수, 작성자의 이름/이메일

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-17-19-36-04.png)

<br>

- 조회 화면: 게시글의 번호, 제목, 내용, 댓글 개수, 작성자 이름/이메일

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-17-19-36-55.png)

<br>

엔티티 클래스들은 실제 데이터베이스상에서는 두 개 혹은 두 개 이상의 테이블로 생성되기 때문에 연관관계를 맺고 있다는 것은 데이터베이스의 입장으로 보면 조인이 필요하다는 것이다. 실제로 @ManyToOne의 경우에는 **FK 쪽의 엔티티를 가져올 때 PK 쪽의 엔티티도 같이 가져온다.**

BoardRepositoryTests를 통해서 Member를 @ManyToOne으로 참조하고 있는 Board를 조회하는 테스트 코드를 작성해 본다.

<br>

**BoardRepositoryTests 클래스 일부**
```java
    @Test
    public void testRead1(){
        Optional<Board> result=boardRepository.findById(100L);
        Board board=result.get();
        System.out.println(board);
        System.out.println(board.getWriter());
    }
```
위의 코드를 실행하면 쿼리가 내부적으로 left outer join 처리가 된 것을 확인 가능하다.

Reply와 Board 역시 @ManyToOne의 관계이므로 테스트를 하면 자동으로 조인이 처리되는 것을 볼 수 있다. 

<br>

**ReplyRepositoryTests 클래스**
```java
    @Test
    public void readReply1(){
        Optional<Reply> result=replyRepository.findById(1L);
        Reply reply=result.get();
        System.out.println(reply);
        System.out.println(reply.getBoard());
    }
```

<br>

위 코드를 실행하면 조인이 처리된 쿼리가 실행이 된다.

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-18-12-26-49.png)

<br>

실행된 SQL을 보면 reply 테이블, board 테이블, member 테이블까지 모두 조인으로 처리가 되는 것을 볼 수 있는데 Reply를 가져올 때 매번 Board와 Member까지 조인해서 가져올 필요가 많지는 않으므로 위와 같은 여러 테이블이 조인으로 처리되는 상황은 그다지 효율적이지 않다.

위와 같이 연관관계를 가진 모든 엔티티를 같이 로딩하는 것을 'Eagar loading'이라고 하는데 '즉시 로딩'이라는 용어로 표현한다. 이는 모든 엔티티를 가져오는 장점이 있지만 여러 연관관계를 맺고 있거나 연관관계가 복잡해질수록 조인으로 인한 성능 저하를 피할 수 없다. 그래서 JPA에서는 연관관계 데이터를 어떻게 가져올 것인가에 대해서 fetch라고 하는 것을 정의 한다. 

즉시 로딩이 불필요한 조인까지 처리한다면 그와 반대되는 개념이 'Lazy Loading'이다. 
Board 클래스를 수정해보자.

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-18-12-30-23.png)

<br>

**Lazy loading를 사용하는 Board 클래스**
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
    @ManyToOne(fetch=FetchType.LAZY)
    private Member writer;
}

```

<br>

Lazy loading를 적용했다면 다시 BoardRepositorTests의 testRead1()을 실행해보자.
실행해보면 알겠지만 오류가 날것이다. 그 이유는 바로 board.getWriter() 때문인데 이는 member 테이블을 로딩해야 하는데 이미 데이터베이스와의 연결은 끝난 상태이기 때문이다. 그래서 오류 내용 중에 'no Session'이라는 내용은 그러한 내용이다. 

이러한 무제를 해결하기 위해서는 다시 한번 데이터베이스와의 연결이 필요한데 @Transactional이 바로 해결책이다. 그래서 이것을 다시 추가해준다.

<br>

**BoardRepositoryTests**
```java
    @Transactional
    @Test
    public void testRead1(){
        Optional<Board> result=boardRepository.findById(100L);
        Board board=result.get();
        System.out.println(board);
        System.out.println(board.getWriter());
    }
```

<br>

트랜잭션 어노테이션은 필요할 때 다시 데이터베이스와 연결이 생성된다. 이 코드를 실행하면 board 테이블만을 로딩해서 처리하고 있지만 getWriter()를 하기 위해서 memeber 테이블을 로딩하는 것을 볼 수 있다. 


<br>

**연관관계에서의 @ToString() 주의사항**

내가 Board 객체의 @ToString()을 하게 되면 해당 클래스의 모든 멤버 변수를 출력하게 되는데 이는 Board의 객체와 writer 변수로 선언된 Member 객체 역시 출력하게 된다. 즉 Member를 출력하기 위해서는 Memeber 객체의 toString()이 호출되어야 하고 이때 데이터베이스 연결이 필요하게 된다.

이런 문제로 인해 연관관계가 있는 엔티티 클래스의 경우 @ToString()을 할 때는 습관적으로 **exclude 속성**을 사용하는 것이 좋다.

exclude는 해당 속성값으로 지정된 변수는 toString()에서 제외하기 때문에 지연 로딩을 할 때는 반드시 지정해 주는 것이 좋다.


<br>

## **JPQL과 left(outer) join**

<br>

목록 화면에서 게시글의 정보와 함께 댓글의 수를 같이 가져오기 위해서는 단순히 하나의 엔티티 타입을 이용할 수 없다. 이에 대한 해결책 중에서 가장 많이 쓰이는 방식은 JPQL의 조인(join)을 이용하는 것이다.

Board엔티티 클래스의 내부에는 Member 엔티티 클래스를 변수로 선언하고, 연관관계를 맺고 있다. 이러한 경우에는 Board의 wrtier 변수를 이용해서 조인을 처리한다.

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

public interface BoardRepository extends JpaRepository<Board, Long>, SearchBoardRepository {
    //한 개의 로우(Object) 내에 Object[]로 나옴
    @Query("select b, w from Board b left join b.writer w where b.bno=:bno")
    Object getBoardWithWriter(@Param("bno") Long bno);
}

```

getBoardWithWriter()는 Board를 사용하고 있지만, Member를 같이 조회해야 하는 상황이다. Board 클래스에는 Member와의 연관관계를 맺고 있으므로 b.writer와 같은 형태로 사용한다. 이처럼 내부에 있는 엔티티를 이용할 때는 'LEFT JOIN' 뒤에 'ON'을 이용하는 부분이 없다. 작성한 getBoardWithWriter()를 테스트 코드로 확인하자.

<br>

**BoardRepositoryTests 테스크 코드**
```java
    @Test
    public void testReadWithWriter(){
        Object result=boardRepository.getBoardWithWriter(100L);
        Object[] arr=(Object[])result;
        System.out.println("-------------------------------");
        System.out.println(Arrays.toString(arr));
    }
```
<br>

테스트 코드의 실행 결과를 보면 지연 로딩으로 처리되었으나 실행되는 쿼리를 보면 조인 처리가 되어 한 번에 board 테이블과 member 테이블을 이용하는 것을 확인할 수 있다.

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-18-12-54-46.png)

작동하는 원리를 보면 BoardRepository 인터페이스의 getBoardWithWriter 함수의 매개변수 bno가 위의 @Query부분의 마지막 b.bno=:bno에서 =:bno의 들어가게된다. 그러면 이 bno를 기준으로해서 Board b에 writer를 Left outer join하는 것이다.
@Query부분을 보면 select b, w 이 부분은 board의 b 그리고 member의 w인데 각 엔티티의 where 조건에 해당하는 모든 필드들을 가져온다. 

**[Left Outer Join의 개념](https://haenny.tistory.com/34)**

<br>

Board와 Member 사이에는 내부적으로 참조를 통해서 연관관계가 있지만 Board와 Reply는 좀 상황이 다르다. 

**Reply 쪽이 @ManyToOne으로 참조하고 있으나 Board 입장에서는 Reply 객체들을 참조하고 있지 않기 때문에 문제가 발생한다.**

이런 경우에는 직접 조인에 필요한 조건은 **'on'**을 이용해서 작성해 줘야 한다.

**'특정 게시물과 해당 게시물에 속한 댓글들을 조회'**해야 하는 상황을 고려해 보자. 이
때는 board와 reply 테이블을 조인해서 쿼리를 작성하게 된다.

**[SQL ON과 WHERE의 차이점](https://blog.leocat.kr/notes/2017/07/28/sql-join-on-vs-where)**

제일 중요한 것은 @Query 부분에 ON r.board=b 가 있어야 된다는 것이다. 연관관계가 있는 경우와 비교해 보면 중간에 'on'이 사용되면서 조인 조건을 직접 지정하는 부분이 추가되는 것이다.

이제 BoardRepositoryTests 클래스에 테스트 코드를 작성해 보자.

<br>

**BoardRepositoryTests**
```java
    @Test
    public void testGetBoardWithReply(){
        List<Object[]> result=boardRepository.getBoardWithReply(100L);

        for(Object[] arr: result){
            System.out.println(Arrays.toString(arr));
        }
    }
```

<br>

이 코드를 실행하면 다음과 같은 결과가 나온다.

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-18-13-32-38.png)

다시 목록 화면에서 필요한 데이터를 정리해 보자

- 게시물(Board): 게시물의 번호, 제목, 게시물의 작성 시간
- 회원(Member): 회원의 이름/이메일
- 댓글(Reply): 해당 게시물의 댓글 수

저 세 엔티티 중에서 우리가 가장 많이 데이터를 가져오게 될 엔티티는 Board이다 그래서 Board를 기준으로 조인 관계를 작성한다.

**Member는 Board 내에 wrtier 라는 필드로 연관관계를 맺고 있고 Reply는 연관관계가 없는 상황이다.**

조인 후에는 Board를 기준으로 'GROUP BY' 처리를 해서 **하나의 게시물 당 하나의 라인이 될 수 있도록 처리해야 한다.**

BoardRepository에는 Pageable을 파라미터로 전달받고, Page<Object[]> 리턴 타입의 getBoardWithReplyCount()를 아래와 같이 작성한다.

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

public interface BoardRepository extends JpaRepository<Board, Long>, SearchBoardRepository {
    //한 개의 로우(Object) 내에 Object[]로 나옴
    @Query("select b, w from Board b left join b.writer w where b.bno=:bno")
    Object getBoardWithWriter(@Param("bno") Long bno);
    @Query("SELECT b, r FROM Board b LEFT JOIN Reply r ON r.board=b WHERE b.bno=:bno")
    List<Object[]> getBoardWithReply(@Param("bno") Long bno);

    @Query(value="SELECT b, w, count(r) " +
    " FROM Board b "+
    " LEFT JOIN b.writer w "+
    " LEFT JOIN Reply r ON r.board=b"+
    " GROUP BY b",
    countQuery ="SELECT count(b) FROM Board b")
    Page<Object[]> getBoardWithReplyCount(Pageable pageable);
}

```

<br>

BoardRepositoryTests에는 정상적으로 JPQL이 동작 가능한지 확인해 준다.

<br>

**BoardRepositoryTests 클래스 일부**
```java
    @Test
    public void testWithReplyCount(){
        Pageable pageable= PageRequest.of(0,10, Sort.by("bno").descending());
        Page<Object[]> result=boardRepository.getBoardWithReplyCount(pageable);
        result.get().forEach(row->{
            Object[] arr=(Object[])row;
            System.out.println(Arrays.toString(arr));
        });
    }
```
1페이지의 데이터를 처리한다고 가정하고 페이지 번호는 0으로 지정하고, 10개를 조회한다. 위의 테스트 코드의 실행 결과로 발생하는 쿼리 결과는 아래와 같다.

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-18-13-52-41.png)

![](/images/Learning_SpringBoot_with_Web_Project/Part3/Chapter5/2021-02-18-13-52-56.png)

_혹여나 countQuery에 대해 궁금한 게 있다면 책의 80pg를 참고한다_

이제 조회 화면에서 필요한 JPQL를 구성해본다.

조회 화면에서는 Board와 Member를 주로 이용하고, 해당 게시물이 몇 개의 댓글이 있는지를 알려주는 수준으로 작성한다. 실제 댓글은 화면에서 주로 Ajax를 이용해서 필요한 순간에 동적으로 데이터를 가져오는 방식이 일방적이다. 작성하는 JPQL은 목록 화면과 유사하게 다음과 같은 형태가 된다.

<br>

**BoardRepository 인터페이스 일부**
```java
public interface BoardRepository extends JpaRepository<Board, Long>, SearchBoardRepository {
    //한 개의 로우(Object) 내에 Object[]로 나옴
    @Query("select b, w from Board b left join b.writer w where b.bno=:bno")
    Object getBoardWithWriter(@Param("bno") Long bno);
    @Query("SELECT b, r FROM Board b LEFT JOIN Reply r ON r.board=b WHERE b.bno=:bno")
    List<Object[]> getBoardWithReply(@Param("bno") Long bno);

    @Query(value="SELECT b, w, count(r) " +
    " FROM Board b "+
    " LEFT JOIN b.writer w "+
    " LEFT JOIN Reply r ON r.board=b"+
    " GROUP BY b",
    countQuery ="SELECT count(b) FROM Board b")
    Page<Object[]> getBoardWithReplyCount(Pageable pageable);

    @Query("SELECT b, w, count(r) " +
    " FROM Board b LEFT JOIN b.writer w " +
    " LEFT OUTER JOIN Reply r ON r.board=b"+
    " WHERE b.bno= :bno")
    Object getBoardByBno(@Param("bno") Long bno);
}

```

<br>

보면 목록처리와 비슷하지만 특정한 게시물 번호를 사용하는 부분에서 차이가 있다. 
테스트 코드는 다음과 같이 작성한다

<br>

**BoardRepositoryTests 클래스 일부**
```java
    @Test
    public void testRead3(){
        Object result=boardRepository.getBoardByBno(100L);
        Object[] arr=(Object[])result;
        System.out.println(Arrays.toString(arr));
    }
```

그리고 실행해서 결과를 확인해 본다.