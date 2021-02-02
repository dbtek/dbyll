---
layout: post
title: 코드로 배우는 스프링 부트 웹 프로젝트-Part4-02
date: 2021-02-02 14:00:00 0000
tags: [Intellij, SpringBoot]
categories: [SpringBoot]
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

``` java
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
``` java
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
    @Query("select m, mi, avg(coalesce(r.grade,0)), count(distinct r) from Movie m "+"left outer join MovieImage mi on mi.movie=m "+
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
``` java 
    @Query("select m, mi, avg(coalesce(r.grade,0)), count(r) "+
            "from Movie m left outer join MovieImage mi on mi.movie=m " +
            "left outer join Review r on r.movie=m "+
            "where m.mno=:mno group by mi")
    List<Object[]> getMovieWithAll(Long mno);
```
- left outer join 추가와 마지막의 group by  부분에 영화 이미지별로 그룹을 만들어서 영화 이미지들의 개수만큼 데이터를 만들어 낼 수 있게 됨