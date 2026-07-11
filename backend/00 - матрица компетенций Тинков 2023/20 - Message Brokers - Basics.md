# Message Brokers Basics

## Уровни навыка

### Уровень 1
**Обязательно:**
- Знает, для чего в принципе нужны брокеры сообщений, какие задачи решают.
- Знает сущности: producer, consumer, queue.

### Уровень 2
**Обязательно:**
- Знает гарантии доставки: at-most-once delivery, at-least-once delivery, exactly-once delivery. Какие, как и где реализовать.

### Уровень 3
**Обязательно:**
- Знает о транзакциях и уровнях изоляции в очередях.
- Умеет организовать идемпотентную обработку сообщений в at-least-once delivery.
- Умеет выбирать брокер сообщений при проектировании. Какую модель лучше выбрать (commit log, queue, pub/sub) — Kafka, RabbitMQ, NATS, AWS Pub/Sub, Redis, PostgreSQL.

## Метод оценки
TODO

## Как прокачать
- *Understanding Message Brokers* by Jakub Korab