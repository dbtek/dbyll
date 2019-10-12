---
layout: post
title:  Kafka Cluster with Docker Compose
categories: [docker, docker-compose, kafka]
fullview: false
---
Apache Kafka is described itself as "distributed commit log" or more recently "distributing streaming platform". Kafka brokers 
can work together in a group to provide distributed environment which called as cluster.   

# Introduction

In this post we will run multiple kafka brokers in a cluster. We will use our local environment to set up a kafka cluster. 
The goal of this blog post is build an cluster environment in the local and then test some distributed
functionality of kafka brokers easily in the local. 

# Configuration  

This project contains two docker-compose files, in this blogpost we will explain and test only the one which is for apache zookeeper, apache kafka and kafka-manager. Other docker compose file will be
described in next blog post. Let's start with kafka configurations.

## Zookeeper configuration

In below configuration first zookeeper nodes are configured. Zookeeper use port 2888 and 3888 for internal cluster communication and expose 2181 for external client communication.
Because we are configuring all three nodes in same server. I added 1, 2, 3 as a suffix to all zookeeper servers port configuration to prevent port collision.
The 2888 ports are used for peers communication and the 3888 ports are used for leader elections. More about you can find in the [official ZooKeeper documentation](https://zookeeper.apache.org/doc/current/zookeeperStarted.html){:target="_blank"}.

```yaml
version: '3.7'
services:
  zookeeper-1:
    image: confluentinc/cp-zookeeper:latest
    hostname: zookeeper-1
    ports:
      - "12181:12181"
    environment:
      ZOOKEEPER_SERVER_ID: 1
      ZOOKEEPER_CLIENT_PORT: 12181
      ZOOKEEPER_TICK_TIME: 2000
      ZOOKEEPER_INIT_LIMIT: 5
      ZOOKEEPER_SYNC_LIMIT: 2
      ZOOKEEPER_SERVERS: zookeeper-1:12888:13888;zookeeper-2:22888:23888;zookeeper-3:32888:33888

  zookeeper-2:
    image: confluentinc/cp-zookeeper:latest
    hostname: zookeeper-2
    ports:
      - "22181:22181"
    environment:
      ZOOKEEPER_SERVER_ID: 2
      ZOOKEEPER_CLIENT_PORT: 22181
      ZOOKEEPER_TICK_TIME: 2000
      ZOOKEEPER_INIT_LIMIT: 5
      ZOOKEEPER_SYNC_LIMIT: 2
      ZOOKEEPER_SERVERS: zookeeper-1:12888:13888;zookeeper-2:22888:23888;zookeeper-3:32888:33888

  zookeeper-3:
    image: confluentinc/cp-zookeeper:latest
    hostname: zookeeper-3
    ports:
      - "32181:32181"
    environment:
      ZOOKEEPER_SERVER_ID: 3
      ZOOKEEPER_CLIENT_PORT: 32181
      ZOOKEEPER_TICK_TIME: 2000
      ZOOKEEPER_INIT_LIMIT: 5
      ZOOKEEPER_SYNC_LIMIT: 2
      ZOOKEEPER_SERVERS: zookeeper-1:12888:13888;zookeeper-2:22888:23888;zookeeper-3:32888:33888

```

Now you may want to test just zookeeper servers. First define the hostname in your local host file. It should be look as below.

```
127.0.0.1	localhost

127.0.0.1 zookeeper-1 zookeeper-2 zookeeper-3

```

Now if you run below docker-compose.yml with ```docker-compose up``` command. After containers are up and running you can check containers name
via ```docker ps```.

<br />

![docker ps zookeeper](	/assets/media/docker_ps_zookeeper.png)

<br />

Because docker-compose file is in kafka folder, default network name is kafka. So
our image names are kafka_zookeeper_1_1, kafka_zookeeper_2_1, kafka_zookeeper_3_1. Let's connect to kafka_zookeeper_1_1.
```docker exec -it docker_zookeeper-1_1 bash```. Now we should be connect to the docker container which is running zookeeper. 
``` zookeeper-shell 127.0.0.1:12181 ``` with  this command we can connect zookeeper server and run below commands to list root, brokers, topics, consumers.

<br />

![zookeeper_command_line](	/assets/media/zookeeper_command_line.png)

<br />

```
ls /
ls /brokers
ls /brokers/topics
ls /consumers
``` 

<br />

Ok, we are sure that zookeeper is working properly.

## Kafka configuration

We will add kafka brokers to the docker-compose.yaml. Kafka needs zookeeper because of controller election, configuration of topics, access control lists, membership of the cluster etc. functionalities.
Kafka brokers depends on zookeeper and open the ports 19092, 29092, 39092 in each. We also have some JMX environment variable for kafka manager which helps to pull some data for monitoring.
  
```yaml
  kafka-1:
    image: confluentinc/cp-kafka:latest
    hostname: kafka-1
    ports:
      - "19092:19092"
    depends_on:
      - zookeeper-1
      - zookeeper-2
      - zookeeper-3
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper-1:12181,zookeeper-2:22181,zookeeper-3:32181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka-1:19092
      KAFKA_JMX_HOSTNAME: "kafka-1"
      KAFKA_JMX_PORT: 9999
      KAFKA_JMX_OPTS: "-Djava.rmi.server.hostname=kafka-1
      -Dcom.sun.management.jmxremote.local.only=false
      -Dcom.sun.management.jmxremote.rmi.port=9999
      -Dcom.sun.management.jmxremote.port=9999
      -Dcom.sun.management.jmxremote.authenticate=false
      -Dcom.sun.management.jmxremote.ssl=false"

  kafka-2:
    image: confluentinc/cp-kafka:latest
    hostname: kafka-2
    ports:
      - "29092:29092"
    depends_on:
      - zookeeper-1
      - zookeeper-2
      - zookeeper-3
    environment:
      KAFKA_BROKER_ID: 2
      KAFKA_ZOOKEEPER_CONNECT: zookeeper-1:12181,zookeeper-2:22181,zookeeper-3:32181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka-2:29092
      KAFKA_JMX_HOSTNAME: "kafka-2"
      KAFKA_JMX_PORT: 9999
      KAFKA_JMX_OPTS: "-Djava.rmi.server.hostname=kafka-2
      -Dcom.sun.management.jmxremote.local.only=false
      -Dcom.sun.management.jmxremote.rmi.port=9999
      -Dcom.sun.management.jmxremote.port=9999
      -Dcom.sun.management.jmxremote.authenticate=false
      -Dcom.sun.management.jmxremote.ssl=false"

  kafka-3:
    image: confluentinc/cp-kafka:latest
    hostname: kafka-3
    ports:
      - "39092:39092"
    depends_on:
      - zookeeper-1
      - zookeeper-2
      - zookeeper-3
    environment:
      KAFKA_BROKER_ID: 3
      KAFKA_ZOOKEEPER_CONNECT: zookeeper-1:12181,zookeeper-2:22181,zookeeper-3:32181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka-3:39092
      KAFKA_JMX_HOSTNAME: "kafka-3"
      KAFKA_JMX_PORT: 9999
      KAFKA_JMX_OPTS: "-Djava.rmi.server.hostname=kafka-3
      -Dcom.sun.management.jmxremote.local.only=false
      -Dcom.sun.management.jmxremote.rmi.port=9999
      -Dcom.sun.management.jmxremote.port=9999
      -Dcom.sun.management.jmxremote.authenticate=false
      -Dcom.sun.management.jmxremote.ssl=false"

  kafka_manager:
    image: hlebalbau/kafka-manager:stable
    ports:
      - "9000:9000"
    environment:
      ZK_HOSTS: "zookeeper-1:12181,zookeeper-2:22181,zookeeper-3:32181"
      APPLICATION_SECRET: "random-secret"
    command: -Dpidfile.path=/dev/null

```

When we run the [cleanRun-kafka.sh](https://github.com/muzir/softwareLabs/blob/master/spring-boot-kafka-cluster/cleanRun-kafka.sh){:target="_blank"} file kafka brokers will start in localhost.
Now you may want to test just kafka brokers. First define the hostname in your local host file. It should be look as below.

```
127.0.0.1	localhost

127.0.0.1 zookeeper-1 zookeeper-2 zookeeper-3
127.0.0.1 kafka-1 kafka-2 kafka-3

```

## Configure KafkaCat Tool 

Now let's tests our kafka cluster with [kafkacat tool](https://github.com/edenhill/kafkacat){:target="_blank"}. Produce a message to the test_kafka_cluster topic in kafka-1 broker.

```kafkacat -P -b kafka-1:19092 -t test_kafka_cluster```

Open another tab in the terminal and consume the message in kafka-3 broker via below command.

```kafkacat -C -b kafka-3:39092 -t test_kafka_cluster```

# Result

You can check below diagram for all configuration which described above.

![zookeeper-cluster](	/assets/media/kafka-cluster-step3.gif)

You can find the all project [on Github](https://github.com/muzir/softwareLabs/tree/master/spring-boot-kafka-cluster){:target="_blank"}

# References

[https://better-coding.com/building-apache-kafka-cluster-using-docker-compose-and-virtualbox](https://better-coding.com/building-apache-kafka-cluster-using-docker-compose-and-virtualbox){:target="_blank"}

[https://www.youtube.com/watch?v=CUic2NZKmzo](https://www.youtube.com/watch?v=CUic2NZKmzo){:target="_blank"}

[https://github.com/confluentinc/cp-docker-images](https://github.com/confluentinc/cp-docker-images){:target="_blank"}

[https://docs.confluent.io/current/installation/docker/config-reference.html](https://docs.confluent.io/current/installation/docker/config-reference.html){:target="_blank"}

[https://medium.com/rahasak/kafka-and-zookeeper-with-docker-65cff2c2c34f](https://medium.com/rahasak/kafka-and-zookeeper-with-docker-65cff2c2c34f){:target="_blank"}

[https://github.com/wurstmeister/kafka-docker/wiki/Connectivity](https://github.com/wurstmeister/kafka-docker/wiki/Connectivity){:target="_blank"}

Happy coding :) 
