---
layout: post
title: 스프링부트에서 공공 데이터 API를 이용해서 Highchart와 연동하기-02
date: 2021-03-01 13:00:00 0000
tags: [Intellij, Springboot, Corona Virus, Highchart, 공공 데이터]
categories: [SpringBoot]
description: 스프링부트로 일일 확진자 그래프 만들기
---

<br><br>

# <center>스프링부트로 일일 확진자 그래프 만들기-02</center>

<br><br>

저번 게시물에서는 csv 파일을 파싱해서 Highchart의 line graph로 표시하는 것을 해봤다. 이번 게시물에서는 csv를 사용하지 않고 우리 나라 공공 데이터 사이트에서 제공하는 API를 사용해서 Highchart와 연동을 해보려 한다. 우선 공공데이터 포탈 사이트에 접속해서 알맞은 데이터를 찾는다.

**[공공데이터포털](https://www.data.go.kr/)**

![](/images/SpringBoot/highchart-public-API/2021-03-01-14-00-02.png)

<br>

회원가입을 하고 로그인 후 여기서 검색창에 코로나라고 검색한다. 검색해서 스크롤을 내리다보면 **오픈 API**라고 항목이 보이며 그 목록 중에 **보건복지부*코로나19 감염*현황**이라고 되어 있는 부분이 있다. 그것을 클릭한다.

![](/images/SpringBoot/highchart-public-API/2021-03-01-14-03-48.png)

<br>

들어오게 되면 아래 사진에서 오른쪽에 활용신청 버튼이 있다. 그것을 누르자.

![](/images/SpringBoot/highchart-public-API/2021-03-01-14-04-42.png)

<br>

눌러서 승인을 받게되면 일반 인증키를 발급해 준다. 이것이 바로 서비스 키이다. 이 키를 잘 보관해 둔다. 이 서비스키는 나중에 코드를 작성할 때 쓰게 된다. 자 이제 인텔리제이 프로젝트를 생성해 보자.

![](/images/SpringBoot/highchart-public-API/2021-03-01-14-21-57.png)

<br>

의존성으로는

- Thymeleaf
- Spring Boot DevTools
- Lombok
- Spring Web

을 설정한다.

![](/images/SpringBoot/highchart-public-API/2021-03-01-14-22-30.png)

<br>

이제 아래 그림과 같이 패키지와 자바 파일을 만든다.

![](/images/SpringBoot/highchart-public-API/2021-03-01-14-25-16.png)

<br>

코드를 작성하기 전에 이 API를 좀 더 자세히 살펴보자. 다시 우리가 클릭했던 **보건복지부*코로나19 감염*현황**에 들어가서 스크롤을 제일 아래까지 내리면 각 프로그래밍 언어별로 샘플 코드를 볼 수가 있다.

![](/images/SpringBoot/highchart-public-API/2021-03-01-14-26-28.png)

<br>

우리가 살펴볼 언어는 Java 이므로 클릭해서 복사하고 우리가 생성한 자바 파일에 붙여넣기를 해준다. 붙여넣기 할 때는 클래스 이름을 변경해준다.

**CoronaVirusDataService.java**

```java
package org.techlead.public_api_highcahrt.service;

import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.io.BufferedReader;
import java.io.IOException;

public class CoronaVirusDataService {
    public static void main(String[] args) throws IOException {
        StringBuilder urlBuilder =
        new StringBuilder("http://openapi.data.go.kr/openapi/service/"+
        "rest/Covid19/getCovid19InfStateJson"); /*URL*/
        /*Service Key*/
        urlBuilder.append("?" + URLEncoder.encode("ServiceKey","UTF-8") +
        "=P1wWeheZvhyl1CtYk8BFcVLbUl2Z"+
        "JdoRsu1COpnHeAFmIaLOdBHSmEh1EDLZI~~~~~~~~");
       /*공공데이터포털에서 받은 인증키*/
        urlBuilder.append("&" + URLEncoder.encode("ServiceKey","UTF-8") + "=" +
        URLEncoder.encode("P1wWeheZvhyl1CtYk8BFcVLbUl2ZJ"+"
        doRsu1COpnHeAFmIaLOdBHSmEh1EDLZI~~~~~~~~", "UTF-8"));

        urlBuilder.append("&" + URLEncoder.encode("pageNo","UTF-8") + "="
        + URLEncoder.encode("1", "UTF-8")); /*페이지번호*/
        urlBuilder.append("&" + URLEncoder.encode("numOfRows","UTF-8") + "="
        + URLEncoder.encode("10", "UTF-8")); /*한 페이지 결과 수*/
        urlBuilder.append("&" + URLEncoder.encode("startCreateDt","UTF-8") + "="
        + URLEncoder.encode("20200310", "UTF-8")); /*검색할 생성일 범위의 시작*/
        urlBuilder.append("&" + URLEncoder.encode("endCreateDt","UTF-8") + "="
        + URLEncoder.encode("20200315", "UTF-8")); /*검색할 생성일 범위의 종료*/


        URL url = new URL(urlBuilder.toString());
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/json");
        System.out.println("Response code: " + conn.getResponseCode());
        BufferedReader rd;
        if(conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
            rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        } else {
            rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
        }
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = rd.readLine()) != null) {
            sb.append(line);
        }
        rd.close();
        conn.disconnect();
        System.out.println(sb.toString());
    }
}
```

여기서 중요한 것은 아까 우리가 발급받은 인증키를 넣어줘야 한다. 총 2군대를 넣어줘야 하는데 바로 line 17과 line 22 부분이다. 그런데 line 17에 넣을 땐 앞 문자열 '='를 추가한체로 앞에다가 이어서 넣어준다. 지금 내가 적은 코드를 보면 쓸데없이 긴 인증키를 분해해서 ""+"" 식으로 이어 붙이고 있는데 이는 실제로는 불필요하며 내가 하는 이유는 코드의 한 줄 길이가 길어지면 이 코드 블럭에서 에러가 나기 때문에 일부로 줄 길이를 짧게 만들기 위함이다. 그렇기 때문에 나처럼 분해하지 않고 그냥 붙여넣기 하면 된다.
코드를 정상적으로 붙여넣기 했으면 코드 바로 왼쪽의 초록색 플레이 버튼을 눌러서 실행시켜본다. (둘 중에 어느 것을 눌러도 결과는 똑같다.)

![](/images/SpringBoot/highchart-public-API/2021-03-01-14-31-58.png)

<br>

그리고 출력된 것을 보면 한줄로 길게 xml 형식으로 정보가 나오는 것을 볼 수가 있다.

![](/images/SpringBoot/highchart-public-API/2021-03-01-14-41-25.png)

스크롤을 오른쪽으로 밀다보면 xml 형태로 2020년 3월 10일부터 2020년 3월 15일까지의 코로나 현황을 보여주는 것을 볼 수 있다. 만약 최근 코로나 현황을 보고 싶다면 어떻게 해야 할까? 바로 코드에서 날짜를 바꿔주면 된다.

**CoronaVirusDataService.java의 일부**

```java
(...)
 urlBuilder.append("&" + URLEncoder.encode("startCreateDt","UTF-8") +
  "=" + URLEncoder.encode("20200310", "UTF-8")); /*검색할 생성일 범위의 시작*/
 urlBuilder.append("&" + URLEncoder.encode("endCreateDt","UTF-8") +
 "=" + URLEncoder.encode("20200315", "UTF-8")); /*검색할 생성일 범위의 종료*/
(...)
```

<br>

위 코드에서 날짜 문자열을 바꾸게 되면 그 시작일부터 종료일까지의 코로나 현황이 xml 형태로 출력된다. 먼저 우리가 해야할 건 이 날짜가 시간에 흐름에 따라 유동적으로 바뀔 수 있게 해야 한다. 단순히 저런 식으로 최근 날짜 문자열을 넣어두면 데이터는 더이상의 업데이트가 없을 것이다. 우리가 Highchart에 연동할 때는 현재 날짜로부터 10일전까지만 그래프에 표시할 것임으로 우리는 내일이 지나도, 내일 모레가 지나도 계속 저절로 현재로부터 10일전 그래프가 보여지도록 해야 한다.

그래서 찾은 해결책이 바로 LocalDateTime 라이브러리를 사용하는 것이다. 자바 파일에 메소드를 추가하자. 그리고 검색할 생성일 범위의 시작과 검색할 생성일 범위의 종료 부분에 그 메소드를 호출해 준다.

**CoronaVirusDataService.java**

```java
    (...)
    public static String getStartCreateDt(){
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyyMMdd");
        LocalDateTime now = LocalDateTime.now();
        return dtf.format(now);
    }
    public static String getEndCreateDt(){
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyyMMdd");
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime then = now.minusDays(11);
        return dtf.format(then);
    }
    public static void main(String[] args) throws IOException {
    (...)
        urlBuilder.append("&" + URLEncoder.encode("startCreateDt","UTF-8") +
        "=" + URLEncoder.encode(getStartCreateDt(), "UTF-8")); /*검색할 생성일 범위의 시작*/
        urlBuilder.append("&" + URLEncoder.encode("endCreateDt","UTF-8") + "=" +
         URLEncoder.encode(getEndCreateDt(), "UTF-8")); /*검색할 생성일 범위의 종료*/
        (...)
```

<br>

getStartCreateDt 메소드는 시작일 문자열을 만들어준다. 이 메소드는 매번 호출될 때마다 현재 날짜를 나타내 줄 것이다. getEndCreateDt 메소드는 매번 호출될 때마다 현재 날짜로부터 11일 전의 날짜 문자열을 만들어 줄 것이다. 방금 전에 우리가 highchart 그래프에다가 10일 동안의 현황을 보여준다고 했는데 왜 11일 전 날짜를 얻는 지 궁금해 할 것이다.

그전에 중요한 것 하나를 확인하는 것을 잊었는데 그것부터 살펴보자. 내가 일반 인증키를 받았던 페이지에 들어가면 아래 그림과 같이 참고문서라고 해서 보건복지부 OpenAPI 활용가이드가 있다. 이것을 클릭해서 다운받고 열어보자.

![](/images/SpringBoot/highchart-public-API/2021-03-01-14-55-12.png)

<br>

word 파일이 열리면 스크롤을 아래로 쭉 내리다보면 **요청/응답 메시지 에제**가 나오는 것을 볼 수 있다.

![](/images/SpringBoot/highchart-public-API/2021-03-01-14-56-19.png)

<br>

위 사진의 xml은 아까 우리가 처음에 초록색 화살표를 눌러서 실행했을 때 한줄로 쭉 나오던 데이터들이다. 그런데 가만히 보니 누적되는 확진자 데이터는 표시되어 있으나 날짜별로 몇명이 걸렸는지는 데이터가 나와 있지 않다. 이 상태에서 오늘 확진자가 몇 명이 늘었나 확인하려면 오늘까지의 누적 확진자 수와 어제까지의 누적 확진자 수를 빼주면 될 것이다. 그래서 우리는 아까 getEndCreateDt 메소드에서 11일 전 날짜를 구하는 것이다. 10일 동안의 확진자 현황을 표시해야 하니까 말이다. 계속 전날이랑 누적 확진자 수를 빼줌으로써 그날 몇명의 확진자가 늘었는지 봐야 한다.

자 이럼으로써 우리는 main 함수가 호출될 때마다 현재 날짜 기준으로 11일 전의 코로나 현황 데이터를 가져오는 것을 알 수 있다.

우리가 워드 파일에서 요청/응답 메시지 예제에서 봤듯이 데이터는 xml형태이다. 즉 우리는 xml 형태를 파싱해서 데이터를 추출하고 그것을 적절한 리스트에 담아준 다음 그것을 컨트롤러에서 model.addAttribute() 형태로 html로 보내주게 되면 그 데이터를 하이차트의 그래프에 표시할 수 있을 것이다.

<br>

먼저 xml를 파싱하는 코드를 작성하고 우리가 데이터를 담을 리스트 변수들을 선언하고 초기화하는 작업을 한 번에 해보자. 많은 코드 변화가 있으니 귀찮으신 분들은 복붙을 추천드립니다.
**CoronaVirusDataService.java**

```java
package org.techlead.public_api_highcahrt.service;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.annotation.PostConstruct;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.io.BufferedReader;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Data
@RequiredArgsConstructor
@Service
public class CoronaVirusDataService {

    private List<Integer> decideList;//날짜별 확진자 수
    private List<Integer> deathList;//날짜별 사망자 수
    private List<Integer> clearList;//날짜별 격리해제 수
    private List<String> dateList;//날짜별 문자열 배열
    private int totalConfirmed; //오늘까지 누적 총 확진자

    public String getStartCreateDt(){
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyyMMdd");
        LocalDateTime now = LocalDateTime.now();
        return dtf.format(now);
    }
    public  String getEndCreateDt(){
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyyMMdd");
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime then = now.minusDays(11);
        return dtf.format(then);
    }
    public  void initialDateList(){
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("MM/dd");
        LocalDateTime now = LocalDateTime.now();
        for(int i=9;i>=0;i--) {
            LocalDateTime date = now.minusDays(i);
            dateList.add(dtf.format(date));
        }
    }
    private String getTagValue(String tag, Element ele) {

        NodeList nodeList = ele.getElementsByTagName(tag).item(0).getChildNodes();


        Node nValue = (Node) nodeList.item(0);


        if(nValue == null) {

            return null;

        }

        return nValue.getNodeValue();

    }// getTagValue


    public void xmlApiTest(String url) {
        decideList=new ArrayList<>();
        deathList=new ArrayList<>();
        clearList=new ArrayList<>();
        dateList=new ArrayList<>();

        try{
            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder  = dbFactory.newDocumentBuilder();
            Document doc = dBuilder.parse(url);


            doc.getDocumentElement().normalize();


            NodeList nodeList = doc.getElementsByTagName("item");


            boolean flag=true;
            for(int temp =0; temp<nodeList.getLength()-2; temp++) {

                Node nNode = nodeList.item(temp);

                Node nNodeTest=nodeList.item(temp+1);

                if(nNode.getNodeType()==Node.ELEMENT_NODE) {

                    Element element = (Element)nNode;

                    Element elementTest=(Element)nNodeTest;


                    decideList.add(Integer.parseInt(getTagValue("decideCnt",element))-
                            Integer.parseInt(getTagValue("decideCnt",elementTest)));
                    deathList.add(Integer.parseInt(getTagValue("deathCnt",element))-
                            Integer.parseInt(getTagValue("deathCnt",elementTest)));
                    clearList.add(Integer.parseInt(getTagValue("clearCnt",element))-
                            Integer.parseInt(getTagValue("clearCnt",elementTest)));

                    if(flag){
                        totalConfirmed=Integer.parseInt(getTagValue("decideCnt",element));
                        flag=false;
                    }
                }//if

            }//for


            initialDateList();

        }catch(Exception e){
            System.out.println(e);
        }

        Collections.reverse(decideList);
        Collections.reverse(deathList);
        Collections.reverse(clearList);


    }
    @PostConstruct
    @Scheduled(cron="* * 1 * * *")
    public void initialData() {
        try{
            StringBuilder urlBuilder = new StringBuilder("http://openapi.data.go.kr/"+
                    "openapi/service/rest/Covid19/getCovid19InfStateJson"); /*URL*/
            urlBuilder.append("?" + URLEncoder.encode("ServiceKey","UTF-8") +
                    "=P1wWeheZvhyl1CtYk8BFcVLbUl2ZJd!!!!~~~~"); /*Service Key*/
            /*공공데이터포털에서 받은 인증키*/
            urlBuilder.append("&" + URLEncoder.encode("ServiceKey","UTF-8") +
                    "=" + URLEncoder.encode("P1wWeheZvhyl1CtYk8BFcVLbUl2ZJ!!!!~~~~", "UTF-8"));
            urlBuilder.append("&" + URLEncoder.encode("pageNo","UTF-8") +
                    "=" + URLEncoder.encode("1", "UTF-8")); /*페이지번호*/
            urlBuilder.append("&" + URLEncoder.encode("numOfRows","UTF-8") +
                    "=" + URLEncoder.encode("10", "UTF-8")); /*한 페이지 결과 수*/
            /*검색할 생성일 범위의 시작*/
            urlBuilder.append("&" + URLEncoder.encode("startCreateDt","UTF-8") +
                    "=" + URLEncoder.encode(getEndCreateDt(), "UTF-8"));
            /*검색할 생성일 범위의 종료*/
            urlBuilder.append("&" + URLEncoder.encode("endCreateDt","UTF-8") +
                    "=" + URLEncoder.encode(getStartCreateDt(), "UTF-8"));
            URL url = new URL(urlBuilder.toString());
            xmlApiTest(url.toString());
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Content-type", "application/json");

            BufferedReader rd;
            if(conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
                rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            } else {
                rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
            }
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = rd.readLine()) != null) {
                sb.append(line);
            }
            rd.close();
            conn.disconnect();

        }catch(Exception e){
            System.out.println(e);
        }


    }



}
```

> **line 49**: 이 메소드에서는 dateList 리스트 배열을 초기화한다. 이 dateList 문자열 배열에는 추후에 그래프에서 X 축에 찔힐 문자열을 나타내준다. 포맷은 월/일 형식으로 나타내기 위해 DateTimeFormatter.ofPattern를 설정하고 for 문으로 나머지 날짜 문자열을 저장한다.<br>

> **line 57**: getTagValue 메소드 우리가 원하는 태그의 데이터를 추출할 수 있게 해준다. 파라미터로는 태그 이름과 엘리먼트를 넣어주면 해당하는 데이터 문자열을 반환한다.<br>

> **line 76**: xmlApiTest 메소드에서 각 리스트 변수들을 초기화 해주게 되는데 for 문으로 태그들을 순회하면서 각 문자열 데이터를 얻고 그 데이터를 Int로 파싱한다음 아까 이야기 했던 것처럼 전날과의 차를 이용해서 증가량을 하나씩 넣어주고 있다. 그리고 마지막에 리스트를 reverse하는 것을 볼 수 있는데 이는 그래프에 보여질때 과거부터 현재까지 순서대로 보여주기 위함이다.<br>

> **line 138**: initialData 에서는 샘플 코드를 사용하고 앞에서 만든 xmlApiTest 메소드에 url 파라미터를 넘겨주고 호출한다. 이 메소드는 @Scheduled 어노테이션을 사용함으로써 매일 한 번식 자동으로 호출이 된다. PostConstruct 어노테이션은 어플리케이션이 시작되면 스프링이 이 서비스 객체를 만들게 되고 객체를 다 생성하고 나면 이 @PostConstruct 어노테이션이
> 있는 메소드를 자동으로 실행시켜준다. **@Scheduled** 어노테이션이 동작하게 하려면 아래 그림과 같이 @EnableScheduling를 꼭 추가해야 한다.

![](/images/SpringBoot/highchart-public-API/2021-03-01-15-41-42.png)

<br>

이제 아래 그림과 같이 컨트롤러 클래스를 만든다.

![](/images/SpringBoot/highchart-public-API/2021-03-01-15-46-06.png)

<br>

**HomeController.java**

```java
package org.techlead.public_api_highcahrt.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.techlead.public_api_highcahrt.service.CoronaVirusDataService;


@Controller
public class HomeController {

    @Autowired
    CoronaVirusDataService coronaVirusDataService;




    @RequestMapping("/")
    public String getData(Model model){
        model.addAttribute("dates",coronaVirusDataService.getDateList());
        model.addAttribute("totalConfirmed",coronaVirusDataService.getTotalConfirmed());
        model.addAttribute("increaseFromYesterday",coronaVirusDataService.getDecideList());
        model.addAttribute("dailyCure",coronaVirusDataService.getClearList());
        return "index";
    }
}


```

<br>

자 이제 css와 html를 구성해 보자. 아래 그림과 같이 디렉토리와 파일을 만든다.

![](/images/SpringBoot/highchart-public-API/2021-03-01-15-48-48.png)

<br>

**index.css**

```css
.highcharts-figure,
.highcharts-data-table table {
  min-width: 360px;
  max-width: 800px;
  margin: 1em auto;
}

.highcharts-data-table table {
  font-family: Verdana, sans-serif;
  border-collapse: collapse;
  border: 1px solid #ebebeb;
  margin: 10px auto;
  text-align: center;
  width: 100%;
  max-width: 500px;
}
.highcharts-data-table caption {
  padding: 1em 0;
  font-size: 1.2em;
  color: #555;
}
.highcharts-data-table th {
  font-weight: 600;
  padding: 0.5em;
}
.highcharts-data-table td,
.highcharts-data-table th,
.highcharts-data-table caption {
  padding: 0.5em;
}
.highcharts-data-table thead tr,
.highcharts-data-table tr:nth-child(even) {
  background: #f8f8f8;
}
.highcharts-data-table tr:hover {
  background: #f1f7ff;
}
h2 {
  font-family: sans-serif;
  font-size: 1.5em;
  text-transform: uppercase;
}

strong {
  font-weight: 700;
  background-color: yellow;
}

p {
  font-family: sans-serif;
}
```

<br>

**index.html**

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
  <head>
    <meta charset="UTF-8" />
    <title>Title</title>

    <link th:href="@{/css/index.css}" type="text/css" rel="stylesheet" />
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
  </head>
  <body>
    <div class="container">
      <div
        id="container"
        style="width: 550px; height: 400px; margin: 0 auto"
      ></div>
    </div>

    <script th:inline="javascript">

      var listDates=[[${dates}]];
      var totalConfirmed=[[${totalConfirmed}]];
      var listIncreaseFromYesterday=[[${increaseFromYesterday}]];
      var listDailyCure=[[${dailyCure}]];
      var listDailyDeath=[[${dailyDeath}]];
      Highcharts.chart('container', {

          title: {
              text: '일일 확진자 수'
          },
          subtitle: {
              text: '전체 확진자 수: '+totalConfirmed
          },

          xAxis: {
              // categories: category
              categories: listDates,

              title: {
                  text: '날짜'
              }

          },
          yAxis: {
              title: {
                  text: '전체 확진자 수'
              }
          },

          legend: {
              layout: 'vertical',
              align: 'right',
              verticalAlign: 'middle'
          },

          plotOptions: {
              series: {
                  label: {
                      connectorAllowed: false
                  },
              },
              line: {
                  dataLabels: {
                      enabled: true
                  },
              }
          },

          series: [{
              name: '전날 비교 확진자 수',
              data: listIncreaseFromYesterday
          }, {
              name: '격리 해제',
              data: listDailyCure
          },{
              name: '사망자 수',
              data: listDailyDeath
          },],

          responsive: {
              rules: [{
                  condition: {
                      maxWidth: 500
                  },
                  chartOptions: {
                      legend: {
                          layout: 'horizontal',
                          align: 'center',
                          verticalAlign: 'bottom'
                      }
                  }
              }]
          }

      });
    </script>
  </body>
</html>
```

<br>

이로써 모든 작업이 끝났다~! 이제 앱을 실행시키고 local:8080에 접속해 본다.

![](/images/SpringBoot/highchart-public-API/2021-03-01-15-57-29.png)

정상적으로 표가 나오는 것을 볼 수 있다. 물론 지금 그래프가 깔끔하진 않다. 그것은 highchart api를 사용해서 수정하면 된다.
