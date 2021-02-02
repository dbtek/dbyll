---
layout: post
title: Intellij(인텔리제이)와 AWS의 RDS(MySql)와 S3 연동-04
image: /Program/post-4/main.jpg
date: 2021-02-01 17:00:00 0000
tags: [Intellij, AWS, RDS, S3, MySql,MySql Workbench]
categories: program
---
<br><br>
<br><br>
# <center>Intellij 프로젝트 생성</center>
<br><br><br>

이제 인텔리제이 프로젝트를 만들어 보자.

new Project를 눌러서 프로젝트를 만든다.


![new project](..\..\..\..\images\Program\post-5\newProject.PNG)
<br><br><br>

- Group -> com.young.s3
- Artifact -> s3test.
- Type -> Gradle
- Language -> Java
- Packaging -> War

이렇게 설정하고 Next를 누른다.


![new project name](..\..\..\..\images\Program\post-5\newProjectName.PNG)
<br><br><br>

#### Dependencies 
- SpringBoot DevTools
- Lombok
- Spring Web
- Thymeleaf 
- Spring Data JPA

이렇게 설정하고 Next를 누른다.

![new project dependency](..\..\..\..\images\Program\post-5\newProjectGradle.PNG)
<br><br><br>

마지막으로 Finish를 누른다.

![new project dependency](..\..\..\..\images\Program\post-5\newProjectFinish.PNG)
<br><br><br>

---


### build.gradle 설정하기

주석으로 써진 부분을 보면 mysql를 쓰기 위해 넣어준 코드와 AWS S3를 쓰기 위해서 코드를 써놓는다. 

``` java

plugins {
    id 'org.springframework.boot' version '2.4.2'
    id 'io.spring.dependency-management' version '1.0.11.RELEASE'
    id 'java'
}

group = 'com.young.s3'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '15'

configurations {
    compileOnly {
        extendsFrom annotationProcessor
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    runtimeOnly 'mysql:mysql-connector-java'
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
    //mysql
    compile group: 'mysql', name: 'mysql-connector-java', version: '8.0.22'
    testImplementation ('org.springframework.boot:spring-boot-starter-test'){
        exclude group: 'org.junit.vintage', module: 'junit-vintage-engine'
    }
    // AWS S3
    implementation group: 'org.springframework.cloud', name: 'spring-cloud-starter-aws', version: '2.2.1.RELEASE'
}

```


### application.properties 설정


- 엔드포인트: 본인의 엔드포인트
- 계정명: rds 인스턴스 만들었을 때 입력했던 마스터 사용자 이름
- 비번: rds 인스턴스 만들었을 때 입력했던 마스터 암호
- 디비명: 아래 그림 참고

아래 3줄은 어플리케이션을 실행했을 때 실제 인텔리제이에서 실행하는 query를 표시해 준다.

디비명은 이 그림과 같이 mysql workbench에서 SCHEMAS에서 만든 데이터베이스 명으로 한다.
![dbName]](..\..\..\..\images\Program\post-5\dbName.PNG)
<br><br><br>
``` java
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://엔드포인트:3306/디비명?serverTimezone=UTC&characterEncoding=UTF-8
spring.datasource.username=계정명
spring.datasource.password=비번

spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.show-sql=true
```
이전에 만든 rds에서 엔드포인트를 복사해서 붙여넣는다.

![endPoint](..\..\..\..\images\Program\post-5\endpoint.PNG)
<br><br><br>

### Intellij Database 설정
ctrl+shift+a를 누르게 되면 search를 할 수가 있는데
여기서 database를 입력하고 누른다.

![search](..\..\..\..\images\Program\post-5\search.png)
<br><br><br>

그 다음에 플러스 버튼을 datasource를 선택하고 mysql누르고 생성을 한다.

![datasource](..\..\..\..\images\Program\post-5\datasource.PNG)
<br><br><br>

하나의 창이 뜨게 된다.

- Name: 이름
- Host: 엔드포인트
- User: 마스터 사용자 이름
- Password: 마스터 사용자 암호

이렇게 쓰고 Test Connection를 누르게 되면 저렇게 초록색 체크 표시가 나온다.
이제 OK를 누르고 생성을 하면 된다.

![create](..\..\..\..\images\Program\post-5\create.PNG)
<br><br><br>

---

### 프로젝트 구성

프로젝트 구성은 이런 식으로 구성한다.

![project_structure](..\..\..\..\images\Program\post-5\project.PNG)
<br><br><br>

먼저 데이터베이스가 제대로 작동하는지 확인하기 위해 domain/entity 아래 GalleryEntity 코드를 먼저 작성한다.

**여기서 @Table(name="gallery") 부분에서 빨간줄이 나와도 괜찮다.**

``` java
package com.young.s3.s3test.domain.entity;

import lombok.*;

import javax.persistence.*;

@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString
@Builder
@Table(name="gallery")
@Entity
public class GalleryEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50, nullable = false)
    private String name;

    @Column(length = 50, unique = true, nullable=false)
    private String phoneNum;

    @Column(columnDefinition = "TEXT")
    private String filePath;

}
```
그리고 JPA 사용을 위해서 GalleryRepository 인터페이스 코드를 작성한다

``` java
package com.young.s3.s3test.domain.repository;

import com.young.s3.s3test.domain.entity.GalleryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GalleryRepository extends JpaRepository<GalleryEntity, Long> {
}
```
**어플리케이션을 시작해보자**

이렇게 gallery 테이블이 만들어진 것을 볼 수 있다.

![schema](..\..\..\..\images\Program\post-5\schema.PNG)
<br><br><br>

그리고 다시 오른쪽에 Database 창에 가서 rds-test 옆에 1of5라고 되어 있는 것을 클릭해 본다.

![1of5](..\..\..\..\images\Program\post-5\1of5.PNG)
<br><br><br>

그러다 보면 스키마 리스트가 나오는데 여기서 자신이 만든 데이터베이스 이름, 여기선 rds_test를 체크한다.

![check](..\..\..\..\images\Program\post-5\check.PNG)
<br><br><br>

체크하고 나면 방금 어플리케이션을 실행해서 만든 필드들이 나타나는 것을 볼 수 있다.

![checkok](..\..\..\..\images\Program\post-5\checkok.PNG)
<br><br><br>
다음 게시물에서는 인텔리제이에서 프로젝트를 만들고 실질적으로 이전 게시물에서 생성한 RDS와 S3를 연동해보도록 하겠다.

---

#### 다음 게시물에서는 이제 S3를 연동하고 마무리를 해보자