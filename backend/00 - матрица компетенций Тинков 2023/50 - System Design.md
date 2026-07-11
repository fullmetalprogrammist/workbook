# System Design

## Уровни навыка

### Уровень 1
**Обязательно:**
- Знает основы архитектуры client-server.

### Уровень 2
**Обязательно:**
- Знает принципы монолитной архитектуры (в том числе модульный монолит).
- Знает основы микросервисной архитектуры (зачем нужны, понимает плюсы и минусы, service discovery, клиентская и серверная балансировки).
- Знает отличия и особенности при проектировании синхронных и асинхронных систем.
- Умеет проектировать системы, соблюдая практики безопасности.

**Желательно:**
- Знает принципы и отличия stateless от stateful сервисов.
- Знает, когда лучше применить микросервисную, а когда монолитную архитектуру.

### Уровень 3
**Обязательно:**
- Знает DDD (Tactical Patterns, Strategy Patterns, Event Storming).
- Знает и умеет использовать паттерны микросервисной архитектуры (CQRS, Event Sourcing, 2PC, Saga).
- Знаком с архитектурными стилями (микросервисы, event-driven architecture, SOA, Microkernel, Serverless).
- Умеет реализовывать и тестировать распределенные системы.
- Умеет документировать систему с помощью UML, проводить и внедрять ADR и RFC.
- Умеет подготавливать архитектуру к нарастающей нагрузке (например, практики нагрузочного тестирования, авто-скейлинг).

**Желательно:**
- Знает и умеет применять *Patterns of Enterprise Application Architecture*.
- Знает основы Service Mesh.

### Уровень 4
**Обязательно:**
- Знает большинство архитектурных стилей. Умеет выбрать и применить на практике.
- Умеет решать проблему C10M.
- Знает Chaos Monkey тестирование.
- Знает и умеет применять эволюционную архитектуру.

**Желательно:**
- Знает устройство децентрализованной P2P архитектуры.
- Умеет реализовывать real-time системы.

## Метод оценки
TODO

## Как прокачать
- *Designing Data-Intensive Applications* by Martin Kleppmann
- *Fundamentals of Software Architecture* by Mark Richards, Neal Ford
- *Microservices Patterns* by Chris Richardson
- *Building Microservices*, 2nd Edition by Sam Newman
- *Building Evolutionary Architectures* by Neal Ford, Rebecca Parsons, Patrick Kua
- *Designing Distributed Systems* by Brendan Burns
- *Architecting for Scale*, 2nd Edition by Lee Atchison
- *Cloud Native* by Boris Scholl, Trent Swanson, Peter Jausovec
- *Monolith to Microservices* by Sam Newman
- *Release It!*, 2nd Edition by Michael T. Nygard
- 12 Factor App
- Подключиться к каналу ~architecture и следить за апдейтами и прочитать прошлые посты
- Просмотреть видео с канала System Design
- Просмотреть лекции по дизайну в курсе по SRE