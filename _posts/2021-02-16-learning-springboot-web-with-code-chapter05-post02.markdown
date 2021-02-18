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
 @Transactional
    @Test
    public void testRead1(){
        Optional<Board> result=boardRepository.findById(100L);
        Board board=result.get();
        System.out.println(board);
        System.out.println(board.getWriter());
    }
```
위의 코드를 실행하면 쿼리가 내부적으로 left outer join 처리가 된 것을 확인 가능하다.

