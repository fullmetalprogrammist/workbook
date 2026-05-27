









- Сообщения - что такое
- В целом разобраться с концепциями gRPC в общих чертах, потом уже применительно к джаве расписать
- Как в реальных системах разрабы обмениваются этими прото-файлами и настраивают совместную работу сервисов по gRPC?
- В gRPC бывают `BlockingStub` (синхронные вызовы), `FutureStub` (асинхронные) и `Stub` (для потоковых вызовов)







# Черновик

```xml
<dependency>
	<groupId>net.devh</groupId>
	<artifactId>grpc-server-spring-boot-starter</artifactId>
	<version>3.1.0.RELEASE</version>
</dependency>
<dependency>
	<groupId>javax.annotation</groupId>
	<artifactId>javax.annotation-api</artifactId>
	<version>1.3.2</version>
</dependency>
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-configuration-processor</artifactId>
	<optional>true</optional>
</dependency>
```



Плагины

```xml
<plugin>
	<groupId>org.xolstice.maven.plugins</groupId>
	<artifactId>protobuf-maven-plugin</artifactId>
	<version>0.6.1</version>
	<configuration>
		<protocArtifact>com.google.protobuf:protoc:3.21.12:exe:${os.detected.classifier}</protocArtifact>
		<pluginId>grpc-java</pluginId>
		<pluginArtifact>io.grpc:protoc-gen-grpc-java:1.57.2:exe:${os.detected.classifier}</pluginArtifact>
		<protoSourceRoot>${project.basedir}/src/main/proto</protoSourceRoot>
	</configuration>
	<executions>
		<execution>
			<goals>
				<goal>compile</goal>
				<goal>compile-custom</goal>
			</goals>
		</execution>
	</executions>
</plugin>
```





Расширения

```xml
<extensions>
	<extension>
		<groupId>kr.motd.maven</groupId>
		<artifactId>os-maven-plugin</artifactId>
		<version>1.7.1</version>
	</extension>
</extensions>
```







1. Определите .proto файл с сервисом ProductService и методом CheckExists.  
2. Запустите компиляцию proto через Maven (mvn compile) для генерации Java-классов.  
3. В Products реализуйте интерфейс сгенерированного сервера, аннотировав класс @GrpcService.  
4. В Products добавьте метод checkExists, вызывающий ProductRepository.existsById.  
5. В application.yml Products укажите grpc.server.port (например, 9090).  
6. В Users создайте интерфейс-клиент, аннотированный @GrpcClient, и внедрите его в FavoritesService.  
7. В application.yml Users настройте grpc.client.productService.address (static://localhost:9090).  
8. В методе addToFavourites вызовите client.checkExists(productId) и обработайте статус NOT_FOUND.