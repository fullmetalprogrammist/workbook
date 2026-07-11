# Spring

## Уровни навыка

### Уровень 1
**Обязательно:**
- Знает, что такое Spring, какие задачи он решает.
- Знает, какие есть скоупы бинов.
- Знает, какие есть способы создания бинов, синтаксис для этого (аннотации, конфигурации).
- Знает, как инжектить бин и применимость каждого из способов.
- Умеет создать CRUD-сервис на Spring Boot.

### Уровень 2
**Обязательно:**
- Знает, что такое IoC и DI.
- Знает жизненный цикл бинов.
- Знает механизмы работы Spring Boot (автоконфигурации, стартеры).
- Умеет пользоваться Spring Data: DSL интерфейсов, расширения.
- Знает, что делает аннотация `@Transactional` и умеет ей пользоваться.
- Знает, как устроена в общих чертах Spring Security (`SecurityContextHolder`, `SecurityFilterChain`, Expressions).
- Знает внутреннее устройство приложения на Spring MVC (взаимодействие с контейнером сервлетов, Servlet, Servlet API, устройство фреймворка).
- Умеет решать неоднозначные случаи внедрения (две реализации интерфейса, циклические зависимости).
- Знает роль паттерна Proxy в Spring, понимает, за счет чего работают аннотации.
- Знает основы AOP (pointcut, виды advice и т.п.).
- Умеет работать с инструментами тестирования Spring.
- Умеет настраивать логирование различных компонентов Spring. Знает, какую информацию можно из них получить.

**Желательно:**
- Умеет настраивать подключение к Kafka через Spring, отправлять сообщение producer'ом и читать consumer'ом (`KafkaTemplate`, `KafkaListener`).
- Умеет настраивать подключение к RabbitMQ через Spring, отправлять сообщение producer'ом и читать consumer'ом (`RabbitTemplate`, `RabbitListener`).

### Уровень 3
**Обязательно:**
- Понимает разницу между Servlet Container vs Netty request processing.
- Умеет организовать async processing in servlets and Spring app.
- Умеет разрабатывать приложения, оптимизированные для запуска в облаке (retry, config, metrics, service discovery и т.п. из Spring Cloud).

**Желательно:**
- Знает Reactive Spring (WebFlux, Netty).
- Умеет кастомизировать стандартный Spring Boot (отключать ненужные автоконфигурации и т.п.).

## Метод оценки
TODO

## Как прокачать
- *Spring in Action*, Fifth Edition by Craig Walls
- *Pro Spring 5: An In-Depth Guide to the Spring Framework and Its Tools* by Iuliana Cosmina, Rob Harrop, Chris Schaefer
- *Cloud Native Java* by Kenny Bastani, Josh Long
- Spring Guides
- Конференция SpringOne
- SpringOne 2020
- SpringOne 2021
- Видеозаписи Евгения Борисова "Spring Потрошитель"
  - Spring-потрошитель, часть 1
  - Spring-потрошитель, часть 2
- Marcobehler Blog
- Статьи на Baeldung