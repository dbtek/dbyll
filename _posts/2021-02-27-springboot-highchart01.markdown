---
layout: post
title: 스프링부트에서 CSV를 파싱해서 Highchart의 Line Graph에 표시하기-01
date: 2021-02-27 20:00:00 0000
tags: [Intellij, Springboot, Corona Virus, Highchart]
categories: Springboot
description: 스프링부트로 일일 확진자 그래프 만들기
---

<br><br>

# <center>스프링부트로 일일 확진자 그래프 만들기-01</center>

<br><br>

이번 게시물에서는 스프링부트와 Highchart를 이용해서 일일 확진자 표를 만들어보는 작업해보겠다.

Highchart가 뭔지 간략하게 살펴보자. 하이차트는 자바스크립트와 html로 만든 차트 솔루션이다. 비상업용으로 사용할 땐 무료이고 상업적으로 사용할 땐 비용이 든다. 사이트는 아래 링크를 통해 들어갈 수 있다.

**[Highchart 공식 사이트](https://www.highcharts.com/demo)**

<br>

![](/images/SpringBoot/highchart/2021-02-27-20-18-58.png)

<br>

하이차트 공식 홈페이지에서 이렇게 Demos 카테고리에 들어오게 되면 각종 그래프에 대한 소스가 오픈되어 있어서 그대로 가지고 와서 쓸 수 있다. 여기서 우리는 Basic Line 그래프를 이용해서 코로나 일일 확진자 데이터를 가지고 그래프에 표시를 해볼 예정이다.

<br>

자 이제 시작해보자.

새로운 프로젝트를 만든다.

![](/images/SpringBoot/highchart/2021-02-27-20-21-34.png)

![](/images/SpringBoot/highchart/2021-02-27-20-22-11.png)

<br>

의존성으로는

- Thymeleaf
- Spring Boot DevTools
- Lombok
- Spring Web

으로 설정한다. 추후에 또 필요한 게 있으면 gradle에 추가해주면 된다.

이렇게 프로젝트를 생성이 완료가 되면 우리는 첫 번째 단계로 데이터를 파싱하는 작업을 할 것이다. 이전 게시물 중에 Corona Tracker App 게시물을 봤다면 익숙할 것이다.

데이터는 이 사이트에 있는 csv 파일에서 가져올 예정이다.

**[Github](https://github.com/CSSEGISandData/COVID-19)**

<br>

아래 그림과 같은 경로로 가다보면 time_series_covid19_confirmed_global.csv이라는 파일을 볼 수 있다. 그것을 클릭하면 사진에서 보는 것과 같이 모든 나라의 확진자 수를 날짜별로 보여주고 있다. 굳이 여기서 데이터를 가져오는 이유는 이 csv 파일은 매일매일 실시간으로 업데이트 되기 때문이다. 그럼으로 우리는 매일매일의 최신 데이터를 그대로 이 파일을 통해 가져오면 되는 것이다.

![](/images/SpringBoot/highchart/2021-02-27-20-25-56.png)

<br>

위 사진에서 오른쪽 중간에 Raw 라고 되어 있는 버튼을 눌러보자. 그러면 아래와 같은 데이터들이 나올 것이다. 이 페이지의 링크를 저장해 놓는다.

![](/images/SpringBoot/highchart/2021-02-27-20-31-21.png)

이제 다시 프로젝트로 돌아가자. 아래 사진과 같이 패키지와 자바 클래스를 만든다. 그리고 gradle에 들어가서 csv 파싱을 위해 우리가 사용할 'Commons Csv' 라이브러리와 opencsv를 사용하기 위한 작업을 한다.

![](/images/SpringBoot/highchart/2021-02-27-21-02-56.png)
<br>

**build.gradle**
![](/images/SpringBoot/highchart/2021-02-27-21-07-26.png)

```java
  implementation group: 'com.opencsv', name: 'opencsv', version: '3.7'
  compile 'org.apache.commons:commons-csv:1.8'
```

<br>

**바뀐 의존성을 적용하는 버튼**

![](/images/SpringBoot/highchart/2021-02-27-20-38-07.png)

이제 다시 우리가 방금 생성했던 자바 클래스 중 CoronaVirusDataService.java에 들어가서 코드를 작성해 보자.

**CoronaVirusDataService.java**

```java
package org.techlead.highchart_csv_example.services;


import lombok.Data;
import org.apache.commons.csv.CSVFormat;
import com.opencsv.CSVReader;
import org.apache.commons.csv.CSVRecord;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.*;
import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;


@Service
@Data
public class CoronaVirusDataService {

    //Raw 데이터가 있는 URL 저장
    private static String VIRUS_DATA_URL = "https://raw.githubusercontent.com/"+
            "CSSEGISandData/COVID-19/master/"+
            "csse_covid_19_data/csse_covid_19_time_series/"+
            "time_series_covid19_confirmed_global.csv";
    private List<String> dates = new ArrayList<>();
    private List<Integer> datesConfirmed = new ArrayList<>();
    private List<Integer> increaseFromYesterday = new ArrayList<>();


    //이 어노테이션은 어플리케이션이 시작되면 스프링은
    //이 서비스 객체를 만들게 되고 객체를 다 생성하고 나면
    //이 @PostConstruct 어노테이션이
    //있는 메소드를 자동으로 실행시켜준다.
    @PostConstruct
    //이 메소드를 매초 실행하라고 알려주는 것이다.
    //* * * * * *는 년도, 달, 일, 시간, 분, 초를 나타낸다.
    @Scheduled(cron = "* * 1 * * *")
    //http call를 할 메소드
    //client.send부분에서 send 함수를 쓰려면 exception를 받아야 한다.
    //그것을 받는 대신 throw를 하겠다.
    //client.send이 실패하면 exception를 throw한다.
    public void fetchVirusData() throws IOException, InterruptedException {
        //우리가 Http call를 하기 위해서는 HttpClient를 사용한다.
        HttpClient client = HttpClient.newHttpClient();


        //빌더 패턴을 사용가능하게 해주고 위에 선언한 VIRUS_DATA_URL 문자열을 uri로 바꾸기 위한 작업이다.
        //어디로 Http 요청을 할지 설정한다.
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(VIRUS_DATA_URL))
                .build();

        //이제 client를 보냄으로써 response를 받을 것이다.
        //첫 번째 파라미터로는 request 그리고 두 번째로는 bodyHandler를 넣는다.
        //BodyHandler는 Body를 무엇을 할 건지 정할 수 있는 몇 가지 기능들이 있다.
        //http Body를 문자열로 반환해주는 것이다.
        HttpResponse<String> httpResponse = client.send(request, HttpResponse.BodyHandlers.ofString());


        //StringReader는 String을 Parse하는 리더 객체이다.
        //그래서 나는 String 객체로부터 reader객체가 있는 것이다.
        StringReader csvBodyReader = new StringReader(httpResponse.body());


        //그리고 위해서 반환받은 문자열을 찍어본다.
        // System.out.println(httpResponse.body());

        Iterable<CSVRecord> records = CSVFormat.DEFAULT.withFirstRecordAsHeader().parse(csvBodyReader);


        //csv 헤더를 추출하기 위한 코드 2줄
        URL headerURL = new URL(VIRUS_DATA_URL);
        BufferedReader in = new BufferedReader(new InputStreamReader(headerURL.openStream()));
        CSVReader reader = new CSVReader(in);


       // if the first line is the header
        String[] header = reader.readNext();


        for (CSVRecord record : records) {
            if(record.get("Country/Region").equals("Korea, South")) {

                for (int i = 10; i > 0; i--) {
                    //10일 동안의 날짜 문자열을 얻음
                    dates.add(header[header.length - i]);
                    System.out.println("Dates: " + header[header.length - i]);

                    //10일 동안의 전체 확진자수
                    datesConfirmed.add(Integer.parseInt(record.get(record.size() - i)));
                    System.out.println("Confirmed: " + Integer.parseInt(record.get(record.size() - i)));

                    //제일 최근 전체 확진자 수
                    int latestCases = Integer.parseInt(record.get(record.size() - i));
                    //바로 전날 전체 확진자 수
                    int prevDayCases = Integer.parseInt(record.get(record.size() - (i + 1)));

                    //위 두 변수의 차이로 전날 대비 몇명의 확진자가 증가했는지 구해서 넣는다.
                    increaseFromYesterday.add(latestCases - prevDayCases);
                    System.out.println("Confirmed difference: " + (latestCases - prevDayCases));

                }
            }
        }
    }
}


```

<br>

이제 HomeController.java에 코드를 삽입해 보자

**HomeController.java**

```java
package org.techlead.highchart_csv_example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.techlead.highchart_csv_example.services.CoronaVirusDataService;


@Controller
public class HomeController {

    @Autowired
    CoronaVirusDataService coronaVirusDataService;


    @RequestMapping("/")
    public String getData(Model model){


        model.addAttribute("dates",coronaVirusDataService.getDates());
        model.addAttribute("datesConfirmed",coronaVirusDataService.getDatesConfirmed());
        model.addAttribute("increaseFromYesterday",coronaVirusDataService.getIncreaseFromYesterday());
        return "index";
    }
}

```

다음은 html 파일을 생성할 차례다. 그 전에 아래 그림과 같이 디렉토리와 파일들을 생성한다.

![](/images/SpringBoot/highchart/2021-02-27-22-33-59.png)

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

      const listDates=[[${dates}]];
      const listDatesConfirmed=[[${datesConfirmed}]];
      const listIncreaseFromYesterday=[[${increaseFromYesterday}]];

      Highcharts.chart('container', {

          title: {
              text: '일일 확진자 수'
          },
          subtitle: {
              text: '전체 확진자 수: '+listDatesConfirmed[9]
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
          }],

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

자 이제 모든 것이 완성 되었다. 앱을 실행시켜 보자. 아래 그림과 같이 선 그래프에 날짜별 일일 확진자수를 표시하는 것을 볼 수 있다.

![](/images/SpringBoot/highchart/2021-02-27-22-36-57.png)

<br>

우리가 한 것은 단순히 일일 확진자 밖에 없지만 여기에는 격리해제, 그리고 사망자 수도 포함시킬 수도 있다. 하지만 우리가 파싱한 csv 파일은 단순히 전체 확진자수만을 보여줌으로 다른 데이터를 얻을 수 없다. 하지만 아래 사진과 같이 사망자 수를 정리한 csv 파일, 격리해제된 csv 파일 등 많은 데이터를 볼 수 있다.

![](/images/SpringBoot/highchart/2021-02-27-22-40-31.png)

<br>

문제는 이렇게 csv 파일을 하나하나 다 request하게 하면 비효율적일 뿐만 아니라 그만큼 코드도 길어지고 가독성도 떨어진다. 그렇다면 어떻게 저 그래프에 많은 데이터를 표시하면서 코드는 최대한 간결하게 할 수 있을까? 그것은 바로 공공 데이터 API를 사용하는 것이다. 바로 다음 게시물에서 설명하겠지만 이를 이용하면 모든 코로나에 대한 정보들을 쉽게 접근할 수 있기 때문에 훨씬 효율적이다.

---

다음 게시물은 그래서 공공 데이터 API를 이용해서 얻은 데이터를 highchart 그래프에 표시하는 것이다.
