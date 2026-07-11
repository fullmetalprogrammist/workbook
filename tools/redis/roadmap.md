## 1. Базовая модель данных (обязательно)

Ты должен понимать, что Redis — это:

- key-value хранилище в памяти
- но value не просто строка, а структуры

Основные типы:

- String (самый частый кейс)
- Hash
- List
- Set
- Sorted Set (ZSet)

И когда их использовать:

- String → кэш объекта / токен / число
- Hash → объект с полями (user profile)
- List → очереди / ленты
- Set → уникальные коллекции
- ZSet → рейтинги, топы, лидерборды

------

## 2. TTL и кэширование (очень важно)

Ты должен уверенно понимать:

- TTL (time-to-live)
- eviction policy (LRU/LFU)
- cache-aside pattern

Типичный сценарий:

```
DB → приложение → Redis (cache)
```

и логика:

- сначала читаем Redis
- если miss → идём в DB
- кладём обратно в Redis с TTL

------

## 3. Основные команды / операции (база)

Не обязательно помнить все, но понимать смысл:

- GET / SET
- HGET / HSET
- EXPIRE
- DEL
- INCR / DECR

И что они атомарные (важно для счетчиков).

------

## 4. Конкурентность и атомарность

Ключевая сильная сторона Redis:

- операции атомарны
- нет race conditions на уровне команды

Примеры:

- счётчики
- лайки
- rate limiting

------

## 5. Кэш и сериализация (то, о чём ты спрашивал)

Ты должен понимать:

- Redis хранит байты
- сериализация всегда есть (явная или дефолтная)
- JSON / JDK / Protobuf — выбор клиента

И главное:

> Redis не хранит объекты Java/Python — только байты

------

## 6. Ограничения Redis

Это важно для адекватности:

- всё хранится в RAM
- память дорогая → ограниченный объём данных
- eviction возможен
- не подходит как primary database (в 90% кейсов)

------

## 7. Persistence (базово понимать)

Redis умеет сохранять данные:

- RDB snapshots (снимки)
- AOF (лог операций)

Но:

- Redis всё равно считается in-memory системой

------

## 8. Типовые use-cases (самое важное для собеседований)

Ты должен уверенно говорить:

- caching (основное)
- session storage
- rate limiting
- distributed locks (с оговорками)
- counters / metrics
- leaderboards (Sorted Set)
- queues (простые)

------

## 9. Distributed locks (на уровне понимания)

Знать:

- зачем нужен Redlock (в общих чертах)
- что lock в Redis — это `SET key value NX EX`

И что:

> это не идеальная distributed locking система, есть edge cases

------

## 10. Spring + Redis (если Java)

Для тебя важно:

- Spring Data Redis
- @Cacheable → это abstraction над Redis
- RedisCacheManager управляет поведением кеша
- сериализация настраивается централизованно

------

## 11. Что НЕ обязательно знать (для 90% задач)

Можно не углубляться, если ты не infra/backend platform:

- внутренние структуры памяти Redis
- event loop архитектура
- jemalloc детали
- fork/COW механизм snapshot’ов (RDB deep internals)
- Redis modules (RediSearch, RedisJSON глубоко)