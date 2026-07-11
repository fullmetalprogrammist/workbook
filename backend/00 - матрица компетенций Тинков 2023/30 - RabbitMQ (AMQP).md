# Message Brokers - RabbitMQ (AMQP)

## Уровни навыка

### Уровень 1
**Обязательно:**
- Знает основные понятия: message, exchanges, queues.
- Знает типы exchange: direct, fanout, topic.
- Умеет подключаться к RabbitMQ из приложения, отправлять сообщение producer'ом и читать consumer'ом.

### Уровень 2
**Обязательно:**
- Знает модели подтверждения сообщений (acknowledge): ack, nack, reject.
- Знает основные свойства очереди: durable, exclusive, auto-delete.
- Знает основные параметры настройки клиента.

**Желательно:**
- Умеет настраивать подключение к RabbitMQ правильным образом для своего стека.

### Уровень 3
**Обязательно:**
- Знает архитектуру и внутреннее устройство RabbitMQ.
- Знает расширенные свойства очереди: type, ttl, queue length, consumer priorities.
- Знает особенности работы RabbitMQ в кластере (federated plugin).
- Знает, как выбрать значение prefetch_count.
- Знает, как настроить и использовать встроенный dead letter механизм.

**Желательно:**
- Знает, как интерпретировать метрики (queue size и пр.).

## Метод оценки
TODO

## Как прокачать
- *RabbitMQ in Action: Distributed Messaging for Everyone* by Alvaro Videla, Jason J. W. Williams
- *RabbitMQ in Depth* by Gavin M. Roy