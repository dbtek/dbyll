---
layout: post
title: Template Specs with CIPipelines
tags: [templatespecs,pipelines]
fullview: true
---

Allright, I'll kick off my blogging with a simple but neat solution I created for one or my customers. 

## Background

We're implementing an Enterprise-Scale Architecture at a customer of mine where we're trying to embrace IaC.

We're using AzOps as CI/CD solution for the platform (For those who doesn't now what AzOps is [here's a link](https://github.com/Azure/AzOps), I'll blog about AzOps, but that's for another post 😊)

## Problem

The IT department is comfortable with both Bicep and AzOps, but the rest of the organization who want to utilize Azure isn't.

They want to start using code, but as we know it can be difficult to find the time and opportunity to get acquainted with it.
The people in the organization was however onboard with the portal (hard to use Azure otherwise, right? 😊).

## Solution

So, the solution that worked best for us was the following:

📌 Use Template Specs, this lets the guys in the central IT department write their templates in code

📌 The people in the organization can continue to use the portal but also look at the code behind the template in an easy way.

📌 Since we're using AzOps, we're already utilizing DevOps Pipelines, which made me think of this solution.

## The Technical Part (a.k.a the good part 🤘)

I'll dive straight into the DevOps-world and look at what we need.

Pre.req.

SPN
Contributor permissions
Egen subscription där man kan dela ut allt med RBAC
Pipelinen (Se till så vi bara tar med filer som är ändrade, detta fungerar inte idag.)
Skriptet för att pusha ut filerna
