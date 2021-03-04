---
layout: post
title: 코드로 배우는 스프링 부트 웹 프로젝트-Part2-04
date: 2021-03-04 14:00:00 0000
tags: [Intellij, SpringBoot, Guesbook]
categories: [SpringBoot]
description: 방명록 만들기
---

<br><br>

# <center>등록 페이지와 등록 처리</center>

<br>

등록의 처리는 이미 GuestbookService까지 완성되었기 때문에 GuestbookController에 약간의 코드를 추가해서 처리가 가능하다. 우선은 GuestbookController에 @GetMapping과 @PostMapping을 이용해서 등록 작업을 처리하는 메서드를 작성한다.