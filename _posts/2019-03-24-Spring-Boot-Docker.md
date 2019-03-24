---
layout: post
title:  Spring Boot 2 with Docker
categories: [spring, docker, docker-compose, postgres]
fullview: false
---

Containers have been making revolutionary changes in software world. Previous systems were mostly powered by virtual
machines. Today many software pioneers like Google, Amazon, Redhat and Docker Inc. convert the industry in that way. 
Docker was released in 2013 by Solomon Hykes. Now it is developing by Docker Inc. It is relying on LXC(Linux Containers) which was invented
in 2008 by IBM.  

### Introduction

In  this post, take a look to spring boot project which use docker and docker-compose to work with its postgres
database. See how docker is configured with a spring boot project. 

This post will not explain docker and its concepts in deep. But to be on the same page let's take a look some docker
concepts like Dockerfile, image and container. Dockerfile have all instruction sets of the single image. It may 
extend or contain different images. When build a Dockerfile, it produces an image. When run a Dockerfile, it produces
a container. In that perspective they are look like source code(Dockerfile), compiled code(image) and process(container).   

### Configuration  

There are 2 Dockerfile and 1 docker-compose yaml files inside the project. 


#### Configure spring boot service 

Below Dockerfile is using define java process which is spring boot service jar. It has 3 instructions. First get the ```java:8``` image, then copy created
project jar as service.jar and set the ```ENTRYPOINT``` as how this process should be run.  

```Dockerfile

# Alpine Linux with OpenJDK JRE
FROM java:8
COPY build/libs/spring-boot-containers-0.1.0.jar ./service.jar
ENTRYPOINT exec java $JAVA_OPTS -jar /service.jar

```

#### Configure postgres

Second Dockerfile is under project root > docker > postgres folder. It gets the latest postgres image. Then copy
```init-user-db.sh``` file to ```/docker-entrypoint-initdb.d/init-user-db.sh```. That path is in postgres container.

```Dockerfile
FROM postgres:latest
COPY init-user-db.sh /docker-entrypoint-initdb.d/init-user-db.sh
```

When postgres container start to run, it will use that file as a database initialization. Currently below shell is just
connect the postgres server inside the postgres container and run ```GRANT``` comment for ```POSTGRES_USER```. 


```bash
#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d "$POSTGRES_DB" <<-EOSQL
    GRANT ALL PRIVILEGES ON DATABASE "$POSTGRES_DB" TO "$POSTGRES_USER";
    create table if not exists product
    (
      id  bigint not null constraint product_pkey primary key,
      name  varchar(255) UNIQUE
    );
    CREATE SEQUENCE IF NOT EXISTS hibernate_sequence START 1;
EOSQL

```
   
For more information about initialization script check [postgres docker official documentation](https://docs.docker.com/samples/library/postgres/#initialization-scripts).

#### Configure docker-compose


```POSTGRES_USER``` and ```POSTGRES_DB``` are defined at ```docker-compose.yaml``` under project root > docker folder.
Let's take a look to ```docker-compose.yaml```. There are two services defined. ```postgres``` service will use the Dockerfile
inside the postgres folder so build attribute have postgres folder name. ```environment``` is using to give different
naming to default database, user and password which created in initialization time. Please check above  ```init-user-db.sh``` file
again to see how these parameters are used. That's reason why didn't create any database name as store in ```init-user-db.sh``` file,
because in below file with ```POSTGRES_DB``` environment variable rename the default database name to store.

For more information check [postgres environment variable documentation](https://hub.docker.com/_/postgres). 
 

```yaml

version: "3.7"
services:
  postgres:
    build: postgres
    environment:
      POSTGRES_USER: dbuser
      POSTGRES_PASSWORD: password
      POSTGRES_DB: store
    ports:
    - 5432:5432
  spring-boot-containers:
    build: ../
    ports:
      - "12345:12345"
    links:
      - postgres
    environment:
      SPRING_PROFILES_ACTIVE: dev
      JAVA_HEAP_SIZE_MB: 1024

```
Second service definition named as ```spring-boot-containers```. It has Dockerfile definition in parent folder so
build attribute set it as ```../```. It linked postgres service which means it needs that service. Also environment variable
```SPRING_PROFILES_ACTIVE``` is set to dev, which will initialize spring boot dev profile when service is started. Service will expose its
 port on 12345.


### How to run the project

As last step run the service via below commands. These commands are combined in ```cleanRun.sh``` so it is easy to
run the project just with ```./cleanRun.sh```

```bash
./gradlew clean build -x test
cd docker || exit
docker-compose down -v
docker-compose up --build
cd .. || exit
```

Now application is started to run on ```http://localhost:12345```. Send POST request with below body to 
```http://localhost:12345/v1/product``` to create a product.

```json
    {"name":"product001"}
```

Then query product to send GET request to ```http://localhost:12345/v1/product/product001```. 

### Notes

This project should be used in development environment. But it may be used as a base of some project and can be prepare for
production usage as well.


### Result


You can find the all project [on Github](https://github.com/muzir/softwareLabs/tree/master/spring-boot-containers)


### References

https://spring.io/guides/gs/spring-boot-docker/

Happy coding :) 

