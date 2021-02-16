---
layout: post
title: 코드로 배우는 스프링 부트 웹 프로젝트-Part4-02
date: 2021-02-02 14:00:00 0000
tags: [Intellij, SpringBoot]
categories: [SpringBoot]
description: 영화 리뷰 만들기
---

<br><br>

# <center>페이지 처리되는 영화별 평균 점수/리뷰 개수 구하기</center>

<br><br>

**MovieRepository 인터페이스**

```java
public interface MovieRepository extends JpaRepository<Movie,Long> {
   @Query("select m, max(mi), avg(coalesce(r.grade,0)), count(distinct r) from Movie m "+"left outer join MovieImage mi on mi.movie=m "+
            "left outer join Review r on r.movie=m group by m")
    Page<Object[]> getListPage(Pageable pageable);
}
```

<br>

- coalece(a1, a2, a3...): a1부터 aN까지 처음으로 null이 아닌 값을 리턴한다
- 처음 select m은 Movie 엔티티의 모든 엔티티를 선택하게 됨, mi도 마찬가지
- JPQL에서 group by를 적용하면 리뷰의 개수와 리뷰의 평균 평점을 구할 수 있음

<br><br>
MovieRepositoryTests 클래스에 테스트할 수 있는 메서드를 작성한다.

**MovieRepositoryTests 클래스**

```java
    @Test
    public void testListPage(){
        PageRequest pageRequest= PageRequest.of(0,10,Sort.by(Sort.Direction.DESC,"mno"));
        Page<Object[]> result=movieRepository.getListPage(pageRequest);

        for(Object[] objects : result.getContent()){
            System.out.println(Arrays.toString(objects));
        }
    }
}
```

<u>이 코드를 실행하게 되면 예상과 달리 각 영화마다 이미지를 찾는 쿼리가 실행되면서 비효율적으로 여러 번 실행되는 것을 볼 수 있다.</u>

**즉 N+1 문제 발생**

- max()를 사용하지 않으면 join으로 결합될 당시의 데이터 1개만 가져오게 되고 max()를 사용하면 join으로 결합될 당시의 데이터 말고 번호가 가장 큰 이미지 파일(여기서 inum)에 대한 정보를 가져와야하므로 MovieImage에 대한 select문을 1회씩 총 10회 실행됨

JPQL은 별도의 처리 없이 위의 구조를 작성할 수 있다.

```java
    @Query("select m, mi, avg(coalesce(r.grade,0)), count(distinct r) from Movie m "+"left outer join MovieImage mi on mi.movie=m "+
            "left outer join Review r on r.movie=m group by m")
    Page<Object[]> getListPage(Pageable pageable);
```

- max() 부분 제거

### 특정 영화의 모든 이미지와 평균 평점/리뷰 개수

- 영화를 조회할 때는 영화(Movie)뿐 아니라 해당 영화의 평균 평점/리뷰 개수를 화면에서 사용할 일이 있으므로 MovieRepository에 해당 기능을 추가

**MovieRepository 인터페이스**

```java
package org.zerock.mreview.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.zerock.mreview.entity.Movie;
import org.zerock.mreview.entity.MovieImage;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie,Long> {
    @Query("select m, mi, avg(coalesce(r.grade,0)), count(distinct r) from Movie m "+
    "left outer join MovieImage mi on mi.movie=m "+
            "left outer join Review r on r.movie=m group by m")

    Page<Object[]> getListPage(Pageable pageable);

    @Query("select m, mi "+"from Movie m left outer join MovieImage mi on mi.movie=m "+"where m.mno=:mno")
    List<Object[]> getMovieWithAll(Long mno);
}
```

- getMovieWillAll의 @Query 부분에서 m.mno=:mno 의 =:는 getMovieWithAll(Long mno)에서 매개변수인 mno를 의미할 수 있게 함
  - 즉 =:mno는 Long mno의 mno임

**테스트 코드 작성 MovieRepositoryTests**

```java
    @Test
    public void testGetMovieWithAll(){
        List<Object[]> result=movieRepository.getMovieWithAll(94L);
        System.out.println(result);
        for(Object[] arr:result){
            System.out.println(Arrays.toString(arr));
        }
    }
```

리뷰(Review)와 관련된 내용 처리는 'left join'을 이용하면 된다. 리뷰와 조인한 후에 count(), avg() 등의 함수를 이용하게 되는데 이때 영화 이미지(MovieImage) 별로 group by를 실행해야만 한다.

**MovieRepository의 getMovieWithAll() 수정**

```java
    @Query("select m, mi, avg(coalesce(r.grade,0)), count(r) "+
            "from Movie m left outer join MovieImage mi on mi.movie=m " +
            "left outer join Review r on r.movie=m "+
            "where m.mno=:mno group by mi")
    List<Object[]> getMovieWithAll(Long mno);
```

- left outer join 추가와 마지막의 group by 부분에 영화 이미지별로 그룹을 만들어서 영화 이미지들의 개수만큼 데이터를 만들어 낼 수 있게 됨

**특정 영화의 모든 리뷰와 회원의 닉네임**

- 영화 조회 화면에서는 영화 리뷰(Review)를 조회할 수 있어야함
- 자신이 영화에 대한 리뷰를 등록하거나 수정/삭제할 수 있어야함

특정 영화에 대한 영화 리뷰는 ReviewRepository에 다음과 같이 작성한다.

```java
package org.zerock.mreview.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.zerock.mreview.entity.Member;
import org.zerock.mreview.entity.Movie;
import org.zerock.mreview.entity.Review;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMovie(Movie movie);
}
```

이제 findByMovie()에 대한 테스트 코드를 작성해서 Review에서 필요한 데이터를 추출한다.
test repository 안에 ReviewRepositoryTests에 코드를 작성한다.

```java
    @Test
    public void testGetMovieReviews(){
        Movie movie=Movie.builder().mno(92L).build();

        List<Review> result=reviewRepository.findByMovie(movie);
        result.forEach(movieReview->{
            System.out.print(movieReview.getReviewnum());
            System.out.print("\t"+movieReview.getGrade());
            System.out.print("\t"+movieReview.getText());
            System.out.print("\t"+movieReview.getMember().getEmail());
            System.out.println("---------------------------");
        });
    }
```

이때 findByMovie는 쿼리 메서드이다.
Spring Data JPA의 경우 여러 처리를 위해 다음과 같은 방법을 제공한다.

- 쿼리 메서드: 메서드의 이름 자체가 쿼리의 구문으로 처리되는 기능
- @Query: SQL과 유사하게 엔티티 클래스의 정보를 이용해서 쿼리를 작성하는 기능
- Querydsl 등의 동적 쿼리 처리 기능

쿼리 메서드는 말 그대로 메서드의 이름 자체가 질의(query)문이 되는 흥미로운 기능이다. 쿼리 메서드는 주로 'findBy나 getBy...'로 시작하고 이후에 필요한 필드 조건이나 And, Or와 같은 키워드를 이용해서 메서드의 이름 자체로 질의 조건을 만들어 낸다.
자세한 내용은 **Spring Data JPA Reference**를 이용해서 찾는다.

보시다시피 findById 부분인 2번을 읽어보면
"주어진 아이디로 해당 엔티티를 식별할 수 있다"라고 되어 있다.

![ref](/images/Learning_SpringBoot_with_Web_Project/Part4/Chapter7/ref.PNG)
<br><br>

다시 본론으로 돌아와서 testGetMovieReview()를 테스트해 보면 문제가 발생한다. 이것은 Review 클래스의 Member에 대한 Fetch 방식이 LAZY이기 때문이다. 즉 한 번에 Review 객체와 Member 객체를 조회할 수 없기 때문에 발생한다.

< 해결 방법 >

- @Query를 이용해서 조인 처리
- @EntityGraph를 이용해서 Review 객체를 가져올 때 Memeber 객체를 로딩하는 방법
  - 기본적으로 JPA를 이용하는 경우에는 연관 관계의 FATCH 속성값을 LAZY로 지정하는 것이 일반적이나 @EntityGraph는 이러한 상황에서 특정 기능을 수행할 때만 EAGER 로딩을 하도록 지정할 수 있음

_Review를 처리할 때 @EntityGraph를 적용해서 Member도 같이 로딩할 수 있도록 변경_

```java

package org.zerock.mreview.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.zerock.mreview.entity.Member;
import org.zerock.mreview.entity.Movie;
import org.zerock.mreview.entity.Review;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    @EntityGraph(attributePaths={"member"}, type=EntityGraph.EntityGraphType.FETCH)
    List<Review> findByMovie(Movie movie);
}

```

- M:N (다대다)의 관계를 현재와 같이 별도의 매핑 테이블을 구성하고 이를 엔티티로 처리하는 경우 주의 해야 함
  - '명사'에 해당하는 데이터를 삭제하는 경우 중간에 매핑 테이블에서도 삭제를 해야 하기 때문
  - 특정 회원(Member)을 삭제하는 경우 해당 회원이 등록한 모든 영화 리뷰(Review) 역시 삭제되어야 함
    - 특정 회원을 삭제하려면 review 테이블에서 먼저 삭제후 m_member 테이블에서 삭제해야 함

**ReviewRepositroy에는 회원(Member)을 이용해서 삭제하는 메서드를 추가**

```java
package org.zerock.mreview.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.zerock.mreview.entity.Member;
import org.zerock.mreview.entity.Movie;
import org.zerock.mreview.entity.Review;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    @EntityGraph(attributePaths={"member"}, type=EntityGraph.EntityGraphType.FETCH)
    List<Review> findByMovie(Movie movie);
    void deleteByMember(Member member);
}


```

MemberRepository는 JpaRepository의 기능만으로 삭제가 가능하므로 추가할 메서드는 없다. MemberRepositoryTests에는 ReviewRepository를 추가로 주입하고 테스트 코드를 작성한다.

![](/images/Learning_SpringBoot_with_Web_Project/Part4/Chapter7/2021-02-10-20-13-59.png)

**ReviewRepositoryTests 클래스 일부**

```java
package org.zerock.mreview.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mreview.entity.Member;
import org.zerock.mreview.entity.Movie;
import org.zerock.mreview.entity.Review;

import java.util.List;
import java.util.stream.IntStream;

@SpringBootTest
public class ReviewRepositoryTests {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Commit
    @Transactional
    @Test
    public void testDeleteMember(){
        Long mid=1L;
        Member member=Member.builder().mid(mid).build();
       // memberRepository.deleteById(mid);
       // reviewRepository.deleteByMember(member);

        reviewRepository.deleteByMember(member);
        memberRepository.deleteById(mid);
    }


}

```

여기서 중요한 것은 FK로 참조하고 있는 것을 먼저 삭제하고 PK 쪽을 삭제 해야 한다는 것이다.

- @Transactional은 Update나 Delete할 때 씀
  - @Transactional은 기본적으로 스프링의 테스트에서 RollBack 처리를 시도하도록 되어있음
    - 그렇기 때문에 DB에 반영이 안됨
  - RollBack를 하게 하지 않기 위해서는 @Commit를 같이 써주면 됨
    - DB에 반영이 되게 됨

> "update나 delete를 이용하기 위해서는 @Modifying 어노테이션이 반드시 필요하다."

@Query를 이용해서 where 절을 지정하면 효율적으로 삭제가 가능하다.

```java
package org.zerock.mreview.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.zerock.mreview.entity.Member;
import org.zerock.mreview.entity.Movie;
import org.zerock.mreview.entity.Review;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    @EntityGraph(attributePaths={"member"}, type=EntityGraph.EntityGraphType.FETCH)
    List<Review> findByMovie(Movie movie);

    @Modifying
    @Query("delete from Review mr where mr.member=:member")
    void deleteByMember(Member member);
}

```

@Query를 적용한 후에는 한 번에 review 테이블에서 삭제가 된다.
