# Liquibase - что такое, зачем нужно

## Зачем, как работает

- Liquibase - это инструмент для управления миграциями схемы БД
  - Миграция БД - это контролируемое и версионируемое изменение схемы БД
    - Например, добавление \ изменение колонок и т.д. оформляется в виде отдельной миграции, которая имеет версию. Это позволяет откатываться \ накатывать изменения по git-принципу
- Мы описываем в `файле миграции` схему БД
  - Можно делать это в liquibase-специфичном формате через  yaml, json, а она уже переведет это описание в реальные DDL-команды конкретной СУБД
  - А можно использовать обычный сырой SQL

## Детали

- Liquibase не предназначен для создания непосредственно самой БД.
  - БД и пользователя для работы с ней должен создать администратор. Ликвибейз может работать только с уже созданной БД.



# Примеры файлов миграций

## yaml-стиль

```yaml
databaseChangeLog:
  - changeSet:
      id: 1
      author: your.name
      changes:
        - createTable:
            tableName: users
            columns:
              - column:
                  name: id
                  type: SERIAL
                  constraints:
                    primaryKey: true
                    nullable: false
              - column:
                  name: name
                  type: VARCHAR(255)
                  constraints:
                    nullable: false
              - column:
                  name: phone
                  type: VARCHAR(50)
                  constraints:
                    nullable: false
  - changeSet:
      id: 2
      author: your.name
      changes:
        - createTable:
            tableName: favorites
            columns:
              - column:
                  name: id
                  type: SERIAL
                  constraints:
                    primaryKey: true
                    nullable: false
              - column:
                  name: user_id
                  type: BIGINT
                  constraints:
                    nullable: false
              - column:
                  name: product_id
                  type: BIGINT
                  constraints:
                    nullable: false
              - column:
                  name: created_at
                  type: TIMESTAMP
                  defaultValueComputed: CURRENT_TIMESTAMP
                  constraints:
                    nullable: false
        - addUniqueConstraint:
            tableName: favorites
            constraintName: unique_user_product
            columnNames: user_id, product_id
  - changeSet:
      id: 3
      author: your.name
      changes:
        - createIndex:
            tableName: favorites
            indexName: idx_favorites_user_id
            columns:
              - column:
                  name: user_id
```

## sql-стиль

```sql
-- liquibase formatted sql

--changeset your.name:1
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL
);
--rollback DROP TABLE users;

--changeset your.name:2
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, product_id)
);
--rollback DROP TABLE favorites;

--changeset your.name:3
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
--rollback DROP INDEX idx_favorites_user_id;
```





# Базовая настройка для spring boot

## Версия spring boot - какая нужна?

- Версия spring boot > 4

## Зависимости

```xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-liquibase</artifactId>
</dependency>
```

## Настройки

- Пишутся в `src/main/resources/application.yaml`

```yaml
spring:
  application:
    name: user
  datasource:
    url: jdbc:postgresql://localhost:5433/usersdb
    username: admin
    password: admin123
  jpa:
    hibernate:
      ddl-auto: none  # <--
    show-sql: true
  liquibase:  # <--
    enabled: true
    default-schema: public
    change-log: classpath:db/changelog/db.changelog-master.yaml
```

- `change-log` - путь до файла с миграциями

## Файлы с миграциями

- Файлы с миграциями
  - В папке `resources` создаем папки `db/changelog/changeset`
  - В папке `changelog` создаем файл `db.changelog-master.yaml`
    - Можно писать миграции прямо в него, а можно просто перечислять отдельные файлы с миграциями

```yaml
databaseChangeLog:
  - include:
      file: db/changelog/changeset/create-tables.sql
  - include:
      file: db/changelog/changeset/следующий-файл-и-т.д.
```

- Этот файл надо создать обязательно, иначе прога не запустится. Но если пока БД не придумал, а хочется просто прогу запустить, то надо в файл пустой список миграций положить:

```yaml
databaseChangeLog: [ ]
```

- Файлы с непосредственно миграциями кладем в папку `chageset`
  - Например, какой-нибудь такой sql-файл `create-tables.sql` с liquibase'овскими служебными комментариями:

```sql
-- liquibase formatted sql

--changeset your.name:1
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL
);
--rollback DROP TABLE users;

--changeset your.name:2
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, product_id)
);
--rollback DROP TABLE favorites;

--changeset your.name:3
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
--rollback DROP INDEX idx_favorites_user_id;
```

- Теперь при запуске приложения будет запускаться liquibase и приводить БД в состояние, соответствующее миграциям
- TODO: а этот синтаксис sql здесь общий какой-то или специфичный?

## Проблемы

- Из-за версии спринга Liquibase не стартовал
  - Оказалось надо подключить зависимость не `liquibase-core`, а `spring-boot-starter-liquibase`





# Синтаксис описания миграций

## SQL



### Оформление откатов

- Три варианта
  - Код отката короткий, помещается в одну строку
  - Код отката средний, хочется разбить на несколько строк
  - Кот отката большой, хочется поместить в отдельный файл
- Короткий
  - Пишем `--rollback тут-код-отката`

```
--rollback DROP TABLE product_status;
```

- Средний
  - Используем блок rollback

```
/* liquibase rollback
ALTER TABLE products
DROP COLUMN status_id;
*/
```

- Большой
  - TODO подключаем файл





# Черновик

- Два подхода
  - Миграционный
  - На основе состояния
- Как использование liquibase влияет на СУБД-специфичные вещи? Типы например и т.д.
  - А также триггеры, индексы, хранимые процедуры и функции





# TODO

- Вписать как написать "пустой" файл миграций. Если он будет рили пустой, прога не запустится, ошибка будет. Надо написать вот это:

```

```

