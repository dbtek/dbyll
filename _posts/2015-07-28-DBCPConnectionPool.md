---
layout: post
title: DBCP Connection Pooling
categories: [Apache,DBCP]
fullview: true
---

[azorka web](https://github.com/muzir/azorka.web) uygulamami Digital Ocean'da bulunan sunucuma yukledikten bir sure sonra(ne kadar oldugunu bilmiyorum hic baglanti yapilmadan birkac saat icinde) uygulama veri tabani hatasi aliyordu. Logu kontrol ettigimde asagadaki hata mesaji ile karsilastim:

{% highlight yaml %}

java.sql.SQLException: Already closed.
at org.apache.commons.dbcp.PoolableConnection.close(PoolableConnection.java:114)
at org.apache.commons.dbcp.PoolingDataSource$PoolGuardConnectionWrapper.close(PoolingDataSource.java:191)
at org.apache.commons.dbutils.DbUtils.close(DbUtils.java:60)
at org.apache.commons.dbutils.AbstractQueryRunner.close(AbstractQueryRunner.java:438)
at org.apache.commons.dbutils.QueryRunner.query(QueryRunner.java:359)
at org.apache.commons.dbutils.QueryRunner.query(QueryRunner.java:289)
at com.azorka.dao.UserDao.queryUser(UserDao.java:47)
at com.azorka.services.UserService.queryUser(UserService.java:23)
at com.azorka.api.ApiQueryUser.queryUser(ApiQueryUser.java:41)
at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
at java.lang.reflect.Method.invoke(Method.java:497)
at org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:221)
at org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:137)
at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:110)
at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandleMethod(RequestMappingHandlerAdapter.java:777)
at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:706)
at org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:85)
at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:943)
at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:877)
at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:966)
at org.springframework.web.servlet.FrameworkServlet.doPost(FrameworkServlet.java:868)
at javax.servlet.http.HttpServlet.service(HttpServlet.java:644)
at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:842)
at javax.servlet.http.HttpServlet.service(HttpServlet.java:725)
at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:291)
at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:206)
at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:52)
at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:239)
at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:206)
at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:88)
at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)
at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:239)
at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:206)
at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:219)
at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:106)
at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:501)
at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:142)
at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:79)
at org.apache.catalina.valves.AbstractAccessLogValve.invoke(AbstractAccessLogValve.java:610)
at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:88)
at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:537)
at org.apache.coyote.http11.AbstractHttp11Processor.process(AbstractHttp11Processor.java:1085)
at org.apache.coyote.AbstractProtocol$AbstractConnectionHandler.process(AbstractProtocol.java:658)
at org.apache.coyote.http11.Http11NioProtocol$Http11ConnectionHandler.process(Http11NioProtocol.java:222)
at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1556)
at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.run(NioEndpoint.java:1513)
at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)
at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)
at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
at java.lang.Thread.run(Thread.java:745)
{"responseCode":"98","responseMessage":null,"errorCode":"ERR20001","userName":null,"role":null,"email":null,"accessToken":null,"refreshToken":null}

{% endhighlight %}

Bu uzun mesajdan da anlasilacagi uzere uygulama veritabanina baglanamiyor. Aslinda baglanti belli bir sure acik kaliyor ardindan baglanti istegi gelmedigi icin baglanti havuzunda(connection pool) hazir bir baglanti olmuyor ve bu hata aliniyor.Google da sorunu arastirdigimda stackoverflow da bu faydali soru cevabi buldum. [SO sorusuna](http://stackoverflow.com/questions/11125962/correct-way-to-keep-pooled-connections-alive-or-time-them-out-and-get-fresh-one) ve kabul goren cevap hem Apache [DBCP Pool](http://commons.apache.org/proper/commons-dbcp/configuration.html) linkini veriyor  hemde en basit cozum yolunun baglantiyi acik tutmak adina baglanti oncesinde bir kontrol scripti calistirmak oldugunu soyluyor. validationQuery="select 1" scripti ile MYSQL her zaman bu sorguya 1 donecektir ve baglanti oncesinde baglantinin ayakta oldugu bu yolla test edilecektir. Benim ornek pool konfigurasyonum asagadadir. 

{% highlight xml %}

<bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource">
		<property name="driverClassName" value="${jdbc.driverClassName}" />
		<property name="url" value="${jdbc.url}" />
		<property name="username" value="${jdbc.userName}" />
		<property name="password" value="${jdbc.password}" />
		<property name="initialSize" value="5" />
		<property name="maxActive" value="10" />
		<property name="testWhileIdle" value="true" />
		<property name="validationQuery" value="SELECT 1" />
</bean>
{% endhighlight %}