---
layout: post
title: 코드로 배우는 스프링 부트 웹 프로젝트-Part2-02
date: 2021-03-03 14:00:00 0000
tags: [Intellij, SpringBoot, Guesbook]
categories: [SpringBoot]
description: 방명록 만들기
---

<br><br>

# <center>서비스 계층과 DTO</center>

<br>

_해당 내용은 책 '코드로 배우는 스프링부트 웹 프로젝트'의 내용이며 이 게시물은 그 책을 개인적으로 공부하며 메모해 두기 위해서 쓰는 것임을 알려드립니다_

<br><br>

실제 프로젝트를 작성할 경우에 엔티티 객체를 영속 계층 바깥쪽에서 사용하는 방식 보다는 DTO(Data Transfer Object)를 이용하는 방식을 권한다.

DTO는 엔티티 객체와 달리 각 계층끼리 주고받는 우편물이나 상자의 개념이다. 순수하게 데이터를 담고 있다는 점에서는 엔티티 객체와 유사하지만, 목적 자체가 데이터의 전달이므로 읽고, 쓰는 것이 모두 허용되는 점이 가능하고 일회성으로 사용되는 성격이 강하다.

우리는 이제 서비스 계층을 생성하고 서비스 계층에서는 DTO로 파라미터와 리턴 타입을 처리하도록 구성할 것이다. DTO를 사용하면 엔티티 객체의 범위를 한정 지을 수 있기 때문에 좀 더 안전한 코드를 작성할 수 있고 화면과 데이터를 분리하려는 취지에도 좀 더 부합한다. DTO를 사용하는 경우 가장 큰 단점은 Entity와 유사한 코드를 중복으로 개발한다는 점과, 엔티티 객체를 DTO로 변환하거나 반대로 DTO객체를 엔티티로 변환하는 과정이 필요하다는 것이다.

아래와 같이 패키지와 파일을 생성한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-03-14-42-46.png)

<br>

**GuestbookDTO.java**

```java
package org.techlead.guestbook.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class GuestbookDTO {
    private Long gno;
    private String title;
    private String content;
    private String writer;
    private LocalDateTime regDate, modDate;
}

```

<br>

GuestbookDTO는 엔티티 클래스인 Guestbook과 거의 동일한 필드들을 가지고 있고 getter/setter를 통해 자유롭게 값은 변경할 수 있게 구성한다. 서비스 계층에서는 GuestbookDTO를 이용해서 필요한 내용을 전달받고, 반환하도록 처리하는데 Guestbook Service 인터페이스와 GuestbookServiceImpl 클래스를 작성한다.

**GuestbookService interface**

```java
package org.techlead.guestbook.service;

import org.techlead.guestbook.dto.GuestbookDTO;

public interface GuestbookService {
    Long register(GuestbookDTO dto);
}
```

<br>

**GuestbookServiceImpl.java**

```java
package org.techlead.guestbook.service;

import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.techlead.guestbook.dto.GuestbookDTO;

@Service
@Log4j2
public class GuestbookServiceImpl implements GuestbookService{
    @Override
    public Long register(GuestbookDTO dto) {
        return null;
    }
}

```

<br>

GuesbookServiceImpl 클래스에는 스프링에서 빈으로 처리되록 @Service 어노테이션을 추가해주는 것을 잊지 말자.

서비스 계층에서는 파라미터를 DTO 타입으로 받기 때문에 이를 JPA로 처리하기 위해서는 엔티티 타입의 객체로 변환해야 하는 작업이 반드시 필요하다. 이 기능을 DTO 클래스에 적용하거나 ModelMapper 라이브러리나 MapStruct 등을 이용하기도 하는데 이 책의 예제에서는 직접 이를 처리하는 방식으로 작성한다.

이미 책은 직접 처리하는 방식으로 했으므로 우리는 ModelMapper를 사용해서 구성을 해보고 책과 비교를 통해 ModelMapper의 편리성을 느껴본다.

ModelMapper 라이브러리를 사용하려면 일단 build.gradle에 코드를 추가해야 한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-03-15-13-38.png)

<br>

```
compile group: 'org.modelmapper', name: 'modelmapper', version: '2.3.0'
```

한줄을 추가해준다. 그리고 GuestbookService 인터페이스에 코드를 추가하자

**GuestbookService 인터페이스**

```java
package org.techlead.guestbook.service;

import org.modelmapper.ModelMapper;
import org.techlead.guestbook.dto.GuestbookDTO;
import org.techlead.guestbook.entity.Guestbook;

public interface GuestbookService {
    Long register(GuestbookDTO dto);
    default Guestbook dtoToEntity(GuestbookDTO dto){
        ModelMapper modelMapper=new ModelMapper();
        Guestbook entity=modelMapper.map(dto,Guestbook.class);
        return entity;
    }
}

```

<br>

GuestbookService에는 인터페이스 내에 default 기능을 활용해서 구현클래스에서 동작할 수 있는 dtoToEntity()를 구성한다. 책에서는 직접 구현했지만 우리는 ModelMapper를 사용했다. 책에서 나온 코드는 아래와 같다

**GuestbookService 인터페이스 책에 있는 코드**

```java
(...)
    default Guestbook dtoToEntity(GuestbookDTO dto){
        Guestbook entity=Guestbook.builder()
                .gno(dto.getGno())
                .title(dto.getTitle())
                .content(dto.getContent())
                .writer(dto.getWriter())
                .build();
        return entity;
    }
(...)
```

<br>

보시다시피 ModelMapper를 이용하면 더 짧은 줄로 같은 로직을 구현할 수 있다. 그리고 실수를 방지할 뿐만 아니라 지금은 엔티티가 적어서 얼마 차이가 안날지 모르지만 엔티티 개수가 많아지면 많아질 수록 ModelMapper를 사용하면 매우 편리하다는 것을 알 수 있다. 이제 GuestbookServiceImpl 클래스에서 인터페이스를 구현해 본다. GuestbookServiceImpl 클래스에서는 이를 활용해서 파라미터로 전달되는 GuestbookDTO를 변환해 보도록 한다.

**GuestbookServiceImpl 클래스**

```java
(...)
@Service
@Log4j2
public class GuestbookServiceImpl implements GuestbookService{
    @Override
    public Long register(GuestbookDTO dto) {
        log.info("DTO--------------------");
        log.info(dto);

        Guestbook entity=dtoToEntity(dto);

        log.info(entity);

        return null;
    }
}
```

<br>

이제 테스트 코드를 작성해 본다. test 폴더에 service 패키지를 추가하고 아래의 코드를 작성한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-03-15-27-41.png)

<br>

**GuestbookServiceTests**

```java
package org.techlead.guestbook.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.techlead.guestbook.dto.GuestbookDTO;

@SpringBootTest
public class GuestbookServiceTests {
    @Autowired
    private GuestbookService service;

    @Test
    public void testRegister(){
        GuestbookDTO guestbookDTO= GuestbookDTO.builder()
                .title("Sample Title...")
                .content("Sample Content...")
                .writer("user0")
                .build();
        System.out.println(service.register(guestbookDTO));
    }
}
```

<br>

결과는 아래와 같다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-03-15-29-28.png)

<br>

변환 작업에 문제가 없다는 것을 확인했으므로 실제로 데이터 베이스에 처리가 완료되도록 한다.

**GuestbookServiceImpl.java**

```java
@Service
@Log4j2
@RequiredArgsConstructor
public class GuestbookServiceImpl implements GuestbookService {

    private final GuestbookRepository repository;

    @Override
    public Long register(GuestbookDTO dto) {

        log.info("DTO------------------------");
        log.info(dto);

        Guestbook entity = dtoToEntity(dto);

        log.info(entity);

        repository.save(entity);

        return entity.getGno();
    }
```

<br>

GuestbookServiceImpl 클래스는 JPA 처리를 위해서 GuestbookRepository를 주입하고 클래스 선언 시에 **@RequiredArgsConstructor**를 이용해서 자동으로 주입한다. register()의 내부에서는 save()를 통해서 저장하고 저장된 후에 해당 엔티티가 가지는 gno 값을 반환한다.

이제 목록을 처리하는 코드를 작성할 차례다.

목록을 처리하는 작업은 다음과 같은 상황을 고려한다.

- 화면에서 필요한 목록 데이터에 대한 DTO 생성
- DTO를 Pageable 타입으로 전환
- Page<Entity>를 화면에서 사용하기 쉬운 DTO의 리스트 등으로 변환
- 화면에 필요한 페이지 번호 처리

<br>

일단 결과 화면의 구성을 보자.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-03-15-37-39.png)

<br>

목록을 처리하는 작업은 나중에 재사용이 가능한 구조로 생성하는 것이 좋다. 모든 목록을 처리하는 기능에는 페이지 번호나 한 페이지당 몇 개나 출력될 것인가와 같은 공통적인 부분이 많기 때문에 이를 클래스를 이용하면 앞으로 만드는 여러 예제에서 사용할 수 있다.

<br>

작성하려고 하는 PageRequestDTO는 목록 페이지를 요청할 때 사용하는 데이터를 재사용하기 쉽게 만드는 클래스이다. 목록 화면에서는 페이지 처리를 하는 경우가 많이 있기 때문에 '페이지 번호'나 '페이지 내 목록의 개수, 검색 조건'들이 많이 사용된다. PageRequestDTO는 이러한 파라미터를 DTO로 선언하고 나중에 재사용하는 용도로 사용한다.

화면에서 전달되는 목록 관련된 데이터에 대한 DTO를 PageRequestDTO라는 이름으로 생성하고, 화면에서 필요한 결과는 PageResultDTO라는 이름의 클래스로 생성한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-03-15-45-09.png)

<br>

**PageRequestDTO.java**

```java
package org.techlead.guestbook.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Builder
@AllArgsConstructor
@Data
public class PageRequestDTO {

    private int page;
    private int size;
    private String type;
    private String keyword;


    public PageRequestDTO(){
        this.page = 1;
        this.size = 10;
    }

    public Pageable getPageable(Sort sort){

        return PageRequest.of(page -1, size, sort);

    }
}

```

<br>

PageRequestDTO는 화면에서 전달되는 page라는 파라미터와 size라는 파라미터를 수집하는 역할을 한다. 다만 페이지 번호 등은 기본값을 가지는 것이 좋기 때문에 1과 10이라는 값을 이용한다. PageRequestDTO의 진짜 목적은 JPA 쪽에서 사용하는 Pageable 타입의 객체를 생성하는 것이다. 나중에 수정의 여지가 있기는 하지만 JPA를 이용하는 경우에는 페이지 번호가 0부터 시작한다는 점을 감안해서 1페이지의 경우 0이 될 수 있도록 page-1을 하는 형태로 작성한다. 정렬은 나중에 다양한 상황에서 쓰기 위해서 별도의 파라미터로 받도록 설계한다.

<br>

JPA를 이용하는 Repository에서는 페이지 처리 결과를 Page<Entity> 타입으로 반환하게 된다. 따라서 서비스 계층에서 이를 처리하기 위해서도 별도의 클래스를 만들어서 처리해야 한다. 처리하는 클래스는 크게 다음과 같다

- Page<Entity>의 엔티티 객체들을 DTO 객체로 변환해서 자료구조로 담아 주어야 한다.
- 화면 출력에 필요한 페이지 정보들을 구성해 주어야 한다.

<br>

이러한 작업을 위해서 PageResultDTO는 임시로 다음과 같은 형태로 구성한다.

**PageResultDTO.java**

```java
package org.zerock.guestbook.dto;

import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.stream.Collectors;
import java.util.function.Function;
import java.util.List;
import java.util.stream.IntStream;

@Data
public class PageResultDTO<DTO, EN> {
    private List<DTO> dtoList;
    public PageResultDTO(Page<EN> result, Function<EN,DTO> fn){
        dtoList=result.stream().map(fn).collect(Collectors.toList());
    }
}
```

<br>

PageResultDTO 클래스는 다양한 곳에서 사용할 수 있도록 제네릭 타입을 이용해서 DTO와 EN이라는 타입을 지정한다. 말 그대로 DTO와 Entity 타입을 의미한다. PageResultDTO는 Page<Entity> 타입을 이용해서 생성할 수 있도록 생성자로 작성한다. 이때 특별한 Function<EN,DTO>는 엔티티 객체들을 DTO로 변환해 주는 기능이다.

![](/images/Learning_SpringBoot_with_Web_Project/Part2/Chapter4/2021-03-03-15-57-25.png)

<br>

위와 같은 구조는 나중에 어떤 종류의 Page<E> 타입이 생성되더라도, PageResultDTO를 이용해서 처리할 수 있다는 장점이 있다.

서비스 계층에서는 PageReuqestDTO를 파라미터로, PageResultDTO를 리턴 타입으로 사용하는 getList()를 설계하고 엔티티 객체를 DTO 객체로 변환하는 entityToDto()를 정의한다.

**GuestbookService 인터페이스**

```java
package org.techlead.guestbook.service;

import org.modelmapper.ModelMapper;
import org.techlead.guestbook.dto.GuestbookDTO;
import org.techlead.guestbook.dto.PageRequestDTO;
import org.techlead.guestbook.dto.PageResultDTO;
import org.techlead.guestbook.entity.Guestbook;

public interface GuestbookService {
    Long register(GuestbookDTO dto);
    PageResultDTO<GuestbookDTO, Guestbook> getList(PageRequestDTO requestDTO);


    default Guestbook dtoToEntity(GuestbookDTO dto){
        ModelMapper modelMapper=new ModelMapper();
        Guestbook entity=modelMapper.map(dto,Guestbook.class);
        return entity;
    }


    default GuestbookDTO entityToDto(Guestbook entity){
        ModelMapper modelMapper=new ModelMapper();
        GuestbookDTO dto=modelMapper.map(entity,GuestbookDTO.class);
        return dto;
    }
}

```

<br>

entityToDto 메서드는 dtoToEntity 메서드와 같이 ModelMapper를 사용한다. GuestbookServiceImpl 클래스에서는 추가된 getList()를 아래와 같이 구현한다.

**GuestbookServiceImpl.java**

```java
(...)
@Service
@Log4j2
@RequiredArgsConstructor
public class GuestbookServiceImpl implements GuestbookService{
    private final GuestbookRepository repository;
    @Override
    public Long register(GuestbookDTO dto) {
        log.info("DTO--------------------");
        log.info(dto);

        Guestbook entity=dtoToEntity(dto);

        log.info(entity);

        return null;
    }
    @Override
    public PageResultDTO<GuestbookDTO, Guestbook> getList(PageRequestDTO requestDTO) {

        Pageable pageable = requestDTO.getPageable(Sort.by("gno").descending());

        Page<Guestbook> result = repository.findAll(pageable);

        Function<Guestbook, GuestbookDTO> fn = (entity -> entityToDto(entity));

        return new PageResultDTO<>(result, fn );
    }
}

```

<br>

> #### **line 21:** requestDTO로부터 원하는 페이지 값을 가져온다.<br>
> #### **line 23:** repository에서 findAll() 메소드를 통해서 해당 페이지에 데이터베이스 값들을 result에 담는다.<br>
> #### **line 25:** 함수 인터페이스를 사용한다. <br>

## 함수 인터페이스

Fucntion<T,R>는 T타입의 인자를 받고, R타입의 객체를 리턴한다. 즉 위에서는 Guestbook 타입의 인자를 받고 GuestbookDTO 타입의 객체를 리턴하는 것이다.

getList()에서 눈여겨 볼 부분은 entityToDTO()를 이용해서 java.util.Function을 생성하고 이를 PageResultDTO로 구성하는 부분이다. PageResultDTO에는 JPA의 처리 결과인 Page<Entity>와 Function을 전달해서 엔티티 객체들을 DTO의 리스트로 변환하고 화면에 페이지 처리와 필요한 값들을 생성한다.

165페이지
