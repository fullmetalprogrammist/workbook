# ORM

## Уровни навыка

### Уровень 1
**Обязательно:**
- Знает Entity и ее состояния в Hibernate.
- Знает виды связей.
- Знает, что такое пагинация.
- Умеет замапить таблицу на сущность.
- Знает, что такое Spring-репозиторий и как он работает.
- Умеет смотреть запросы в БД (мониторинг и логирование Hibernate).
- Знает про настройки загрузки ассоциаций (`FetchType`).

### Уровень 2
**Обязательно:**
- Умеет настраивать `fetchSize`, `batchSize`.
- Знает настройку загрузки ассоциаций (EntityGraph и во что он превращается).
- Знает проблему N+1 запрос и как ее лечить.
- Знает проблему декартова произведения при JOIN.
- Знает EntityManager.
- Знает каскадные операции (JPA Cascade Types).
- Знает, когда коммитит Spring.
- Знает Hibernate кеш уровень 1.
- Знает, когда происходит flush и commit.
- Знает свойства транзакций (propagation, isolation level, readOnly).
- Умеет выбрать область транзакции (1 транзакция на web-запрос / несколько транзакций на web-запрос).
- Умеет логировать транзакции Spring.

**Желательно:**
- Знает Criteria API, Spring Data Specifications.
- Знает JPQL (JOIN FETCH).

### Уровень 3
**Обязательно:**
- Знает настройки Hibernate.
- Знает Hibernate кеш уровень > 1.
- Умеет делать запросы с проекциями.
- Знает недостатки ORM-подхода и альтернативные фреймворки (jOOQ, jdbi, MyBatis).
- Умеет делать пагинацию + JOIN OneToMany.
- Знает, как транзакция управляется в Spring (ThreadLocal Map, Transactional Listener).
- Знает, что такое вложенные транзакции.

**Желательно:**
- Знает, что такое dirtyChecking.
- Знает инструментацию байт-кода (bytecode-enhancement, как сделать OneToOne реально lazy).
- Знает, что такое checkpoint, 2PC.

## Метод оценки
TODO

## Как прокачать
- *Hibernate in Action* by Christian Bauer and Gavin King
- *Harnessing Hibernate* by James Elliott, Timothy M. O'Brien, Ryan Fowler
- *Java Persistence with Hibernate* by Christian Bauer, Gavin King, Gary Gregory
- *High-Performance Java Persistence* by Vlad Mihalcea