# Message Brokers - Kafka

## Уровни навыка

### Уровень 1
**Обязательно:**
- Знает основные понятия: топик, партиция, группа консьюмеров, паттерн продьюсер-консьюмер (без деталей реализации).
- Умеет подключаться к Kafka из приложения. Может отправить сообщение producer'ом и прочитать consumer'ом.

### Уровень 2
**Обязательно:**
- Знает, что такое offset, retention policy, rebalance в пределах группы.
- Знает про стратегии acks.
- Знает, что такое Kafka Streams и для чего он нужен.
- Знает типы сериализации сообщения (Avro Schema, Protobuf, JSON) и как работает Schema Registry.
- Знает основные параметры настройки топика, продьюсера и консьюмера.

**Желательно:**
- Знает, что такое Kafka Connect и для чего он нужен (если есть в вашем стеке).
- Знает, как работать с партициями и как выбрать ключ партиционирования.
- Умеет настраивать подключение к Kafka правильным образом для своего стека.

### Уровень 3
**Обязательно:**
- Знает архитектуру и внутреннее устройство Kafka broker.
- Знает, как использовать реплицирование для повышения доступности.

**Желательно:**
- Знает паттерны обработки ошибок: fail, ignore, dead letter queue, retry и т.д.
- Знает, как интерпретировать Kafka метрики: consumer lag, size и пр.
- Знает, как написать свой partition assignor.

## Метод оценки
TODO

## Как прокачать
- *Kafka: The Definitive Guide* by Neha Narkhede, Gwen Shapira, Todd Palino
- *Kafka in Action* by Dylan Scott, Viktor Gamov, Dave Klein
- *Effective Kafka: A Hands-On Guide to Building Robust and Scalable Event-Driven Applications with Code Examples in Java* by Emil Koutanov
- *Kafka Streams in Action* by William P. Bejeck Jr.
- *Event Streams in Action* by Alexander Dean, Valentin Crettaz