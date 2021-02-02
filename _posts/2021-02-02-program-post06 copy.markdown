---
layout: post
title: Intellij(인텔리제이)와 AWS의 RDS(MySql)와 S3 연동-05
image: /Program/post-6/main.jpg
date: 2021-02-02 11:00:00 0000
tags: [Intellij, AWS, RDS, S3, MySql,MySql Workbench]
categories: program
---
<br><br>
<br><br>
# <center>Intellij RDS와 S3 연동 마무리</center>
<br><br><br>

**이제 마무리를 해보자**

resource 폴더에서 새로운 file를 생성하기를 눌러서 이름을 application.yml이라고 치면 저절로 저렇게 추가가 된다.

![yml](..\..\..\..\images\Program\post-6\yml.PNG)
<br><br><br>

**yml 파일 내용**
- accessKey, secretKey: AWS 계정에 부여된 key 값을 입력
- bucket: S3 서비스에서 생성한 버킷 이름을 작성
- region: S3를 서비스할 region 명을 작성, 서울일 경우 ap-northeast-2를 작성


``` java
cloud:
  aws:
    credentials:
      accessKey: ------------------
      secretKey: ------------------
    s3:
      bucket: young-java-blog-aws-demo
    region:
      static: ap-northeast-2
    stack:
      auto: false
```

---

이제 클래스의 코드를 추가해보자
일단 service 패키지에서 **GalleryService**의 코드이다
```java
package com.young.s3.s3test.service;

import com.young.s3.s3test.domain.repository.GalleryRepository;
import com.young.s3.s3test.dto.GalleryDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class GalleryService {
    private GalleryRepository galleryRepository;

    public void savePost(GalleryDto galleryDto) {
        galleryRepository.save(galleryDto.toEntity());
    }
}
```
<br><br>
**S3Service**
```java
package com.young.s3.s3test.service;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Service
@NoArgsConstructor
public class S3Service {
    private AmazonS3 s3Client;

    @Value("${cloud.aws.credentials.accessKey}")
    private String accessKey;

    @Value("${cloud.aws.credentials.secretKey}")
    private String secretKey;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.region.static}")
    private String region;

    @PostConstruct
    public void setS3Client() {
        AWSCredentials credentials = new BasicAWSCredentials(this.accessKey, this.secretKey);

        s3Client = AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(this.region)
                .build();
    }

    public String upload(MultipartFile file) throws IOException {
        String fileName = file.getOriginalFilename();

        s3Client.putObject(new PutObjectRequest(bucket, fileName, file.getInputStream(), null)
                .withCannedAcl(CannedAccessControlList.PublicRead));
      //  System.out.println("s3클라이언트 URL:"+s3Client.getUrl(bucket,fileName).toString());
       // System.out.println("s3클라이언트 fileName:"+fileName);
        return s3Client.getUrl(bucket, fileName).toString();
    }
}
```
<br><br>
#### dto 패키지

**GalleryDto**
```java
package com.young.s3.s3test.dto;

import com.young.s3.s3test.domain.entity.GalleryEntity;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class GalleryDto {
    private Long id;
    private String name;
    private String phoneNum;
    private String filePath;

    public GalleryEntity toEntity(){
        GalleryEntity build = GalleryEntity.builder()
                .id(id)
                .name(name)
                .phoneNum(phoneNum)
                .filePath(filePath)
                .build();
        return build;
    }

    @Builder
    public GalleryDto(Long id, String name,String phoneNum, String filePath) {
        this.id = id;
        this.name = name;
        this.phoneNum=phoneNum;
        this.filePath = filePath;
    }
}
```
<br><br>
#### controller 패키지

**GalleryController**

```java
package com.young.s3.s3test.controller;

import com.young.s3.s3test.dto.GalleryDto;
import com.young.s3.s3test.service.GalleryService;
import com.young.s3.s3test.service.S3Service;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Controller
@AllArgsConstructor
public class GalleryController {
    private S3Service s3Service;
    private GalleryService galleryService;

    @GetMapping("/gallery")
    public String dispWrite() {

        return "/gallery";
    }

    @PostMapping("/gallery")
    public String execWrite(GalleryDto galleryDto, MultipartFile file, @RequestParam("phone") String phoneNum, @RequestParam("name") String name) throws IOException {

        String imgPath = s3Service.upload(file);
        galleryDto.setFilePath(imgPath);

       // System.out.println("이름 확인:"+galleryDto.getName());
      //  System.out.println("전화번호 :"+phoneNum);
        galleryDto.setPhoneNum(phoneNum);
        galleryDto.setName(name);
        galleryService.savePost(galleryDto);

        return "redirect:/gallery";
    }
}
```
<br><br>
### html 생성

resources/templates 아래 gallery.html를 생성한다

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <title>S3 파일 업로드 테스트</title>
</head>
<body>
<h1>파일 업로드</h1> <hr>

<form th:action="@{/gallery}" method="post" enctype="multipart/form-data">
    이름 : <input type="text" name="name"> <br>
    전화번호 : <input type="text" name="phone"> <br>
    파일 : <input type="file" name="file"> <br>
    <button>등록하기</button>
</form>

</body>
</html>
```
---
#### 어플리케이션 실행

이제 브라우저에 들어가서 localhost8080/gallery를 입력하고 들어간다.

![http](..\..\..\..\images\Program\post-6\http.PNG)
<br><br><br>

간단한 이미지를 업로드하고 정보를 입력한 다음 등록하기를 누른다.

![upload](..\..\..\..\images\Program\post-6\upload.PNG)
<br><br><br>

mysql workbench에 들어가보면 정상적으로 이미지 url과 입력했던 정보가 들어가 있고
s3 버킷에 들어가면 마찬가지로 이미지가 들어가 있는 게 볼 수 있다.

![rds](..\..\..\..\images\Program\post-6\rds.PNG)
<br><br><br>

![bucket](..\..\..\..\images\Program\post-6\bucket.PNG)
<br><br><br>

---

##### 수고하셨습니다.