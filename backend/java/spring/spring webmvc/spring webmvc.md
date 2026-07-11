



# Прием запроса

- TODO





# Возврат результата

- Принято делать через static-методы из `ResponseEntity`
  - Это обертка для удобного управления статусом, заголовками и телом
    - Последовательность важна - сначала выбираем статус, потом ставим заголовки (если надо), потом тело (если надо)
    - Методы статуса возвращают билдер BodyBuilder, на котором есть методы добавления заголовков, тела и просто build, если кроме статуса ничего не надо. Соответственно и методы заголовков \ тела тоже возвращают BodyBuilder. Метод build возвращает ResponseEntity
  - P.S. Для себя я бы вероятно выбрал универсальный подход и писал бы без сокращений полную цепочку. Кода больше, зато единообразно.

```java
return ResponseEntity.ok().body(someResult);
```



## Указание статуса

- Через отдельные методы для популярных статусов

```java
ResponseEntity.ok();  // 200
ResponseEntity.badRequest();  // 400
ResponseEntity.notFound();    // 404
ResponseEntity.internalServerError();  // 500
// для некоторых других тоже есть, надо гуглить в моменте
```

- Через универсальный метод для любого статуса

```java
ResponseEntity.status(HttpStatus.OK);
```

```java
HttpStatus.OK;  // 200
HttpStatus.BAD_REQUEST;  // 400
HttpStatus.NOT_FOUND;    // 404
HttpStatus.INTERNAL_SERVER_ERROR;  // 500
// Остальные - гуглить в моменте
```

## Добавление заголовков

- через методы `.header()`,  `.headers()` на билдере

```java
ResponseEntity.ok().header("Cache-Control", "max-age=3600")
```

- Для некоторых заголовков также есть отдельные методы
- Можно добавлять пачку заголовков разом

## Добавление тела

- через метод `.body()` на билдере
  - он возвращает ResponseEntity

```java
ResponseEntity.ok().body("hello");
```

- Особенности
  - В некоторые методы статуса можно передать тело напрямую, а в некоторые - нельзя:
    - Важно - если передать в метод статуса тело, тогда уже заголовки не добавишь, т.к. такой метод сразу вернет ResponseEntity, а не билдер

```java
ResponseEntity.ok("hello");  // можно
ResponseEntity.internalServerError("hello");  // нельзя
```

## Формирование ResponseEntity

- через метод `.build()`
  - если цепочка не заканчивается на .body() или в метод статуса не передано тело, надо собрать ResponseEntity явно через build

```java
ResponseEntity.internalServerError().build();
```

