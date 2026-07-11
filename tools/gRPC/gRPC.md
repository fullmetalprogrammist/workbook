# gRPC

## Общие идеи

- `RPC` - Remote Procedure Call, это технология вызова функций, которые располагаются на другом компьютере
  - Вызов может быть синхронный, т.е. пока ответ не получен, вызывающий код приостанавливается, так и асинхронный, режимы см отдельно
  - Вызов происходит по сети, соответственно реализации RPC работают поверх TCP, HTTP
  - Данные сериализуются
- `gRPC` - это реализация от Google
  - `ProtocolBuffers` - это протокол для сериализации передаваемых данных (+ еще и язык для описания этих данных)
  - Основные идеи
    - Мы описываем в специальном `.proto` файле интерфейс и данные (грубо говоря, классы с функциями и что они принимают \ возвращают)
    - Далее компилятор `protoc` генерирует по этому описанию классы для нашего языка
      - Среди них есть клиентские и серверные классы
    - Мы наследуемся от серверных классов и переопределяем бизнес-методы, вписывая свой код
      - Зависит от языка, т.к. не во всех языках есть наследование и классы. Более корректно можно было бы сказать "мы пишем реализации бизнес-методов для сгенерированных интерфейсов"
    - Т.о. в сгенерированных классах лежит весь код для отправки по сети, а мы подклеиваем к ним через наследование и переопределение свою бизнес-логику
    - Вызов удаленного метода инициируем через клиентский класс. Данные сериализуются и уходят по сети, где их ловит серверный класс, обрабатывает и высылает ответ
  - Данные можно передавать практически любой сложности
    - Т.е. не только какие-то примитивные значения, но и объекты со сложными полями, массивы, списки и т.д. Практически все, что можно передать в обычный локальный метод, можно также передать и в удаленный через gRPC
  - Обе стороны - "вызывающая" и "отвечающая" - должны иметь одну и ту же схему ("содержимое proto-файла")
    - Эти стороны называются соответствено клиент и сервер
    - Схема - это схема интерфейса + схема данных





# proto-файл

- В proto-файле описываем сервис с методами, +структуру получаемых \ возвращаемых данных

```protobuf
syntax = "proto3";

package com.mycompany.project.v1;

option java_package = "com.mycompany.project.grpc.v1";
option java_multiple_files = true;

service ProductService {
  rpc GetProduct(GetProductRequest) returns (GetProductResponse);
}

message GetProductRequest {
  int32 product_id = 1;
}

message GetProductResponse {
  int32 product_id = 1;
  string name = 2;
  int64 price = 3;
}
```

## package - пространство имен

- `package` - задает *пространство имен* для описанных в этом файле вещей. Благодаря пространствам имен, например, два сервиса с одинаковыми именами в разных прото-файлах не пересекутся.
  - правила именования обычно такие 
    - компания.команда.проект.**grpc**.модуль.компонент.версия
      - В общем, какая-то логичная комбинация из этих и подобных вещей. Это имя пакета не влияет на имена и пакеты сгенерированных классов, поэтому.
      - Например, есть компания ths, у нее проект microservices, в нем есть микросервис product, который предоставляет функции (т.е. является как бы "сервером функций"), тогда package логично назвать `ths.microservices.product.v1`

## option - платформо-специфичные опции

- `option` - через опции мы можем задать настройки, специфичные для конкретного языка \ платформы
  - `java_package` - задаем пакет, в который попадут сгенерированные классы. Если опцию не указать, тогда пакет будет взят такой же как пространство имен
    - Например, учитывая что в джаве обычно пакеты идут в формате `com.компания.проект.ололо` то задаем `com.foocompany.barproject.grpc.v1.дальше-по-желанию`
      - Т.е. *после* проекта ставим .grpc.v1 
  - `java_multiple_files` - по умолчанию false. Если true, тогда каждая вещь - сервис, типы сообщений и т.д. сгенерируются в отдельный файл. Обычно ставят true

## service - группа методов

- `service` - группа удаленно вызываемых методов. Из сервиса генерируется класс (или если классов в таргет-платформе нет, например go, то в еще какую-то канитель)

## message - входящие \ исходящие данные

- `message` - описываем структуру данных запросов и ответов

```protobuf
message GetProductResponse {
  int32 product_id = 1;
  string name = 2;
  int64 price = 3;
}
```

- числа 1, 2, 3 - это теги для полей. Они используются для сериализации. Названия полей - для кодогенерации и человекочитаемости в будущих классах. Последовательность полей для сериализации не важна, важны теги.





# Базовый пример

- Просто фрагменты, схематично
  - Чтобы в целом понимать шаги, а детали распишу в отдельных разделах

## Proto-файл

- Описываем в нем методы, структуру сообщений и ответов

## Зависимости

### Зависимости

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

### Плагины

#### 1

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

- `protoSourceRoot` - указываем корневую директорию, от которой надо искать proto-файлы

#### 2

- Чтобы мавен видел сгенерированные классы, т.к. они генерируются в папку generated-sources

```xml
<!-- Чтобы при компиляции мавен видел файлы из generated-sources директории -->
			<plugin>
				<groupId>org.codehaus.mojo</groupId>
				<artifactId>build-helper-maven-plugin</artifactId>
				<version>3.6.0</version>
				<executions>
					<execution>
						<id>add-avro-sources</id>
						<phase>generate-sources</phase>
						<goals>
							<goal>add-source</goal>
						</goals>
						<configuration>
							<sources>
								<source>${project.build.directory}/generated-sources/avro</source>
							</sources>
						</configuration>
					</execution>
					<execution>
						<id>add-grpc-sources</id>
						<phase>generate-sources</phase>
						<goals><goal>add-source</goal></goals>
						<configuration>
							<sources>
								<source>${project.build.directory}/generated-sources/protobuf/java</source>
								<source>${project.build.directory}/generated-sources/protobuf/grpc-java</source>
							</sources>
						</configuration>
					</execution>
				</executions>
			</plugin>
```



### Расширения

- Чтобы в protobuf-maven-plugin работали константы `${os.detected.classifier}`

```xml
<extensions>
	<extension>
		<groupId>kr.motd.maven</groupId>
		<artifactId>os-maven-plugin</artifactId>
		<version>1.7.1</version>
	</extension>
</extensions>
```

## Компиляция

- Чтобы в коде стали видны классы и методы, надо в maven запустить шаг compile.

## Клиент

- В сервис, из которого хотим вызывать процедуры, внедряем зависимость - нужный gRPC-сервис
- Создаем объекты сообщений, передаем их в методы, получаем и обрабатываем ответ

```java
@Service
public class FavoritesService {

    private final UserRepository userRepository;
    private final FavoritesRepository favoritesRepository;

    @GrpcClient("productService")
    private ProductServiceGrpc.ProductServiceBlockingStub productStub;  // <-- Внедрили
    
    // ...
    
    public List<FavoriteProductDto> getUserFavorites(Long userId) {
    // ...

    FavoriteProductsResponse response = productStub.getFavoriteProducts(  // <-- Вызвали
        FavoriteProductsRequest.newBuilder().addAllProductIds(favorites).build()
    );

    return response.getProductsList().stream()  // <-- Обработали ответ
        .map(grpcProduct -> FavoriteProductDto.builder()
             .productId(grpcProduct.getProductId())
             .title(grpcProduct.getTitle())
             .price(BigDecimal.valueOf(grpcProduct.getPrice()))
             .build())
        .collect(Collectors.toUnmodifiableList());
}
```

## Сервер

- Пишем свой класс, 
  - Аннотируем его через `@GrpcService`
  - Наследуемся от авто-сгенерированного класса
  - Переопределяем описанные в proto-файле функции, описывая в них свою бизнес-логику
    - Для этого можно внедрить зависимость со своими бизнес-сервисами

```java
@GrpcService  // <-- Аннотация
public class ProductGrpcService 
    	extends ProductServiceGrpc.ProductServiceImplBase {  // <-- Наследуемся

    private final ProductService productService;  // <-- Внедрили свой бизнес-сервис с логикой

    public ProductGrpcService(ProductService productService) {
        this.productService = productService;
    }

    @Override
    public void checkExists(  // <-- Переопределяем методы
            ProductIdRequest request,
            StreamObserver<ExistsResponse> responseObserver
    ) {
        boolean exists = productService.productExists(request.getProductId());
        responseObserver.onNext(ExistsResponse.newBuilder().setExists(exists).build());
        responseObserver.onCompleted();
    }

    @Override
    public void getFavoriteProducts(
            FavoriteProductsRequest request,
            StreamObserver<FavoriteProductsResponse> responseObserver
    ) {
        List<Long> productIds = request.getProductIdsList();
        List<FavoriteProduct> products = productService.getProductsByIds(productIds).stream()
                .map(product -> FavoriteProduct.newBuilder()
                        .setProductId(product.getId())
                        .setTitle(product.getName())
                        .setPrice(product.getPrice().doubleValue())
                        .build())
                .collect(Collectors.toList());

        responseObserver.onNext(FavoriteProductsResponse.newBuilder().addAllProducts(products).build());
        responseObserver.onCompleted();
    }

}
```

## Настройки проекта

- В `application.yaml` добавляем настройки
- Каждое приложение может быть как клиентом, так и сервером одновременно, в зависимости от того с кем общается и для каких целей
  - Вызывает чьи-то удаленные функции - значит клиент
  - Предоставляет удаленные функции кому-то - значит сервер

### Сервер

```yaml
grpc:
  server:
    port: 9090
```

### Клиент

```yaml
grpc:
  client:
    productService:
      address: static://localhost:9090
      negotiationType: plaintext
```





# Детали

## Работа с объектами сообщений

- Параметры функций и их результат всегда оформляются в виде message
  - Т.е. даже если функция принимает примитив, допустим, всего лишь одно целое число, мы все равно описываем message с единственным полем - под это число - и потом создаем объект через билдер и кладем в него число
- Для создания инстансов message в коде используются статические методы-билдеры (`.newBuilder()`) на их классах
  - Например

```protobuf
message FavoriteProduct {
    int64 product_id = 1;
    string title = 2;
    double price = 3;
}
```

```java
var fp = FavoriteProduct.newBuilder()  // <-- newBuilder()
    .setProductId(100)
    .setTitle("Электробритва")
    .setPrice(6000)
    .build();  // <-- build()
```

- Правила
  - Имена полей в сообщениях всегда пишутся через snake_case
  - Компилятор автоматически формирует геттеры \ сеттеры на основе имен полей
  - Метод build() формирует иммутабельный объект
    - Если надо вдруг изменить поле, то надо создавать новый билдер на основе старого объекта и вызывать метод изменения нужного поля, например `FavoriteProduct.newBuilder(foobar).setPrice(4000).build()`
  - Список некоторых геттеров \ сеттеров (для наглядности, а на деле лучше гуглить каждый раз когда надо)

```protobuf
// Для сингл-значений
getProductId();
Builder setProductId();

// Для массивов
getProductIdsList();
getProductIdsCount();
getProductIds(idx);

Builder addProductIds(100);
Builder addAllProductIds(Iterable);
Builder removeProductIds(idx);
Builder clearProductIds();
```

## Настройки для клиента и сервера

- Задаются в `application.yaml` через `gprc.server` и `grpc.client`

```yaml
grpc:
  server:
    port: 9090
  client:
    productService:
      address: static://localhost:9090
      negotiationType: plaintext
```

### Серверные настройки

- todo



### Клиентские настройки

- todo



## Оформление класса сервера

- Компилятор генерирует классы на основе имен из прото-файла
  - Например

```protobuf
service ProductService {
    rpc CheckExists (ProductIdRequest) returns (ExistsResponse);
    rpc GetFavoriteProducts (FavoriteProductsRequest) returns (FavoriteProductsResponse);
}
```

  - Для сервиса `ProductService` сгенерируется класс `ProductServiceGrpc` - исходное имя + суффикс Grpc
  - Внутри него будет абстрактный класс `ProductServiceImplBase` с заглушками методов checkExists и getFavoriteProducts
- Пишем свой класс
  - Аннотируем его через `@GrpcService`
  - Наследуемся от `ProductServiceGrpc.ProductServiceImplBase`
  - Переопределяем методы checkExists и getFavoriteProducts

```java
@GrpcService  // <-- Аннотация
public class ProductGrpcService 
    	extends ProductServiceGrpc.ProductServiceImplBase {  // <-- Наследуемся
    // ...
    @Override
    public void checkExists(  // <-- Переопределяем методы
            ProductIdRequest request,
            StreamObserver<ExistsResponse> responseObserver
    ) {
        boolean exists = productService.productExists(request.getProductId());
        responseObserver.onNext(ExistsResponse.newBuilder().setExists(exists).build());
        responseObserver.onCompleted();
    }
    
    // ...
    public void getFavoriteProducts(
            FavoriteProductsRequest request,
            StreamObserver<FavoriteProductsResponse> responseObserver
    ) {
```

### Переопределение методов

- TODO - что это за параметр и как им пользоваться

```java
@Override
public void checkExists(
    ProductIdRequest request,
    StreamObserver<ExistsResponse> responseObserver
) {
    boolean exists = productService.productExists(request.getProductId());
    responseObserver.onNext(ExistsResponse.newBuilder().setExists(exists).build());
    responseObserver.onCompleted();
}
```







## Оформление клиента

- Клиента мы можем использовать с своих бизнес-классах, в которых нам надо сделать удаленный вызов
- Внедряем клиента как зависимость и пользуемся методами, которые определили в прото-файле
  - P.S. Пример для простоты грязноватый, т.к. gRPC это инфраструктура и мы т.о. завязываемся на инфраструктуру. Можно было бы сделать интерфейс ProductServicePort, написать его gRPC-реализацию и внедрить ее через интерфейс. Но это так, для размышления

```java
@Service
public class FavoritesService {  // <-- Хотим в своем бизнес-сервисе делать gRPC-вызов

    private final UserRepository userRepository;
    private final FavoritesRepository favoritesRepository;
    private final ProductServiceGrpc.ProductServiceBlockingStub productStub;  // <-- Делаем поле
   
    public FavoritesService(
        // <-- Внедрять лучше через конструктор
        @GrpcClient("productService") ProductServiceGrpc.ProductServiceBlockingStub productStub,
        UserRepository userRepository,
        FavoritesRepository favoritesRepository
    ) {
        this.productStub = productStub;
        this.userRepository = userRepository;
        this.favoritesRepository = favoritesRepository;
    }
    
    // ... 
    public List<FavoriteProductDto> getUserFavorites(Long userId) {
        // ...
        FavoriteProductsResponse response = productStub.getFavoriteProducts(  // <-- Вызываем метод
            FavoriteProductsRequest.newBuilder().addAllProductIds(favorites).build()
        );
        // ...
    }
```

- В аннотацию `@GrpcClient` передаем имя из application.yaml
  - В yaml у нас лежат настройки подключения к серверной части grpc
    - О настройках см отдельный раздел

```yaml
grpc:
  client:
    productService:  # <-- Вот это имя надо передавать в аннотацию
      address: static://localhost:9090
      negotiationType: plaintext
```

- Реализация "клиента" называется `заглушка (stub)`
  - Бывает трех видов
    - Названия в разных генераторах могут отличаться
    - Концептуально
      - Синхронный блокирущий - `foobarBlockingStub`, как в примере выше
      - Асинхронный - `foobarStub`
      - Асинхронный - `foobarFutureStub`
    - Подробнее - напишу в отдельных разделах







## TODO

- Как интегрировать gRPC-классы со своими бизнес-классами
- Обработка ошибок (Interceptor)







# TODO

- Где хранить proto-файлы
  - Структура директорий, папки v1, v2 для версионирования
  - Отдельный git-репозиторий, подключение через зависимость, сборка maven-плагином
- Как в реальных системах разрабы обмениваются этими прото-файлами и настраивают совместную работу сервисов по gRPC?
- В gRPC бывают `BlockingStub` (синхронные вызовы), `FutureStub` (асинхронные) и `Stub` (для потоковых вызовов)