# 16. Hibernate / JPA

- [x] Что такое проблема N+1 и как её решить?
- [x] В чём разница между Lazy и Eager загрузкой?
- [x] Когда использовать Lazy, а когда Eager loading?
- [x] Что такое LazyInitializationException и как её избежать?
- [ ] Какие стратегии fetch существуют в Hibernate?
- [ ] Что делает аннотация @BatchSize?
- [ ] Опишите жизненный цикл Entity в Hibernate
- [ ] Что такое состояния: transient, persistent, detached, removed?
- [x] Что такое кэш первого уровня в Hibernate?
- [x] Что такое кэш второго уровня и когда его использовать?
- [x] Как настроить кэш второго уровня?
- [x] Что такое dirty checking в Hibernate?
- [ ] Как работает механизм flush в Hibernate?
- [ ] В чём разница между persist() и merge()?
- [ ] Что делает метод refresh()?
- [x] Что такое EntityManager и чем он отличается от Session?
- [ ] Как реализовать оптимистичную блокировку в JPA?
- [ ] Как реализовать пессимистичную блокировку в JPA?
- [ ] Что такое @Version и зачем она нужна?
- [ ] Как работают каскадные операции (Cascade)?
- [ ] Какие типы Cascade существуют?
- [ ] Что такое orphan removal?
- [ ] Как правильно использовать @OneToMany и @ManyToOne?
- [ ] В чём особенности bidirectional relationships?
- [ ] Как избежать бесконечной рекурсии при сериализации Entity?
- [ ] Что такое JPQL и чем он отличается от SQL?
- [ ] Что такое Criteria API и когда его использовать?
- [ ] Как использовать JOIN FETCH для решения проблемы N+1?
- [ ] Что такое projection в JPA?
- [x] Какие типы наследования поддерживает JPA?

## Дополнительно нашел

- Spring Cache (@Cacheable)
- EntityGraph

В целом список очень хороший. Он покрывает большую часть того, что спрашивают на Junior+/Middle. Я бы оценил покрытие **примерно в 75–80%** от всего, что обычно ожидают знать по Hibernate/JPA.

Разобью по темам.

## ✅ Отлично покрыто (95–100%)

### Загрузка данных (Fetching)

Практически всё есть.

- ✅ N+1
- ✅ Lazy/Eager
- ✅ Когда использовать
- ✅ LazyInitializationException
- ✅ Fetch Strategies
- ✅ JOIN FETCH
- ✅ @BatchSize

Это одна из самых популярных тем на собеседованиях.

------

### Entity Lifecycle

Есть всё необходимое.

- ✅ жизненный цикл Entity
- ✅ transient/persistent/detached/removed
- ✅ persist vs merge
- ✅ refresh
- ✅ dirty checking
- ✅ flush

------

### Кэш

Есть основные вопросы.

- ✅ L1 Cache
- ✅ L2 Cache
- ✅ настройка L2

------

### Связи

Практически полностью.

- ✅ Cascade
- ✅ виды Cascade
- ✅ orphanRemoval
- ✅ OneToMany/ManyToOne
- ✅ bidirectional

------

### Блокировки

Тоже хорошо.

- ✅ optimistic
- ✅ pessimistic
- ✅ @Version

------

### Запросы

Есть основные темы.

- ✅ JPQL
- ✅ Criteria API
- ✅ Projection

------

### Наследование

Есть.

- ✅ inheritance strategies

------

# Что обязательно стоит добавить

Вот этого уже начинает не хватать.

## 1. Persistence Context ⭐⭐⭐⭐⭐

Очень популярная тема.

Например:

> Что такое Persistence Context?

или

> Как работает Persistence Context?

или

> Чем Persistence Context отличается от Database?

Именно через него работают

- dirty checking
- cache первого уровня
- flush

Без понимания Persistence Context многие вопросы остаются поверхностными.

------

## 2. flush() vs commit() ⭐⭐⭐⭐⭐

Очень любят спрашивать.

Например

> Чем flush отличается от commit?

Это практически классика.

------

## 3. FlushMode ⭐⭐⭐⭐

Например

- AUTO
- COMMIT

Когда происходит flush автоматически.

------

## 4. Entity Graph ⭐⭐⭐⭐

Очень современная тема.

Например

> Что такое EntityGraph?

> Когда использовать EntityGraph вместо JOIN FETCH?

Во многих проектах используют именно его.

------

## 5. DTO vs Entity ⭐⭐⭐⭐⭐

Очень частый вопрос.

Например

> Почему нельзя отдавать Entity наружу?

или

> Почему Entity не используют как DTO?

------

## 6. Open Session In View ⭐⭐⭐⭐⭐

Один из самых популярных вопросов.

Например

> Что такое Open Session In View?

> Почему его рекомендуют отключать?

> Какие проблемы вызывает OSIV?

------

## 7. equals() и hashCode() для Entity ⭐⭐⭐⭐⭐

Наверное входит в топ-10 вопросов Hibernate.

Например

> Как правильно реализовать equals/hashCode для Entity?

Очень многие ошибаются.

------

## 8. mappedBy ⭐⭐⭐⭐⭐

Очень любят.

Например

> Что делает mappedBy?

или

> Кто владелец отношения?

------

## 9. owning side relationship ⭐⭐⭐⭐⭐

Следующий вопрос после mappedBy.

------

## 10. FetchType по умолчанию ⭐⭐⭐⭐

Например

Какие FetchType стоят по умолчанию?

Ответ:

ManyToOne → EAGER

OneToMany → LAZY

------

## 11. Как Hibernate определяет INSERT или UPDATE ⭐⭐⭐⭐

Например

> Почему persist делает INSERT, а merge иногда UPDATE?

или

> Как Hibernate понимает, что объект новый?

------

## 12. @Transactional и Hibernate ⭐⭐⭐⭐⭐

Очень желательно.

Например

- как связаны Session и Transaction
- что происходит внутри @Transactional
- когда открывается Persistence Context

------

# Желательно добавить

## Batch fetching

Не только

> @BatchSize

но вообще

> Какие способы борьбы с N+1 существуют?

Например

- JOIN FETCH
- EntityGraph
- BatchSize
- FetchMode.SUBSELECT
- DTO Projection

------

## FetchMode.SUBSELECT

Редко, но спрашивают.

------

## @NamedQuery

Иногда спрашивают.

------

## Native Query

Очень желательно.

Например

Когда использовать Native Query?

------

## Pageable + Hibernate

Если собеседование Spring.

Например

Почему JOIN FETCH плохо работает с Pageable?

------

## EntityManager methods

Кроме persist/merge:

- remove()
- detach()
- clear()
- contains()

------

## ID generation

Очень популярная тема.

Например

- GenerationType.IDENTITY
- SEQUENCE
- TABLE
- UUID
- AUTO

И влияние на batching.

------

## Composite Key

- @EmbeddedId
- @IdClass

------

## Embeddable

@Embeddable

------

## AttributeConverter

Очень любят на Middle.

------

## OptimisticLockException

Что происходит при конфликте.

------

## Hibernate Proxy

Что такое proxy?

Как работает Lazy Loading?

------

# Что можно убрать

Практически ничего.

Единственное:

> Какие типы Cascade существуют?

можно объединить с

> Как работают Cascade?

Это один вопрос.

------

Также

> Что такое @Version?

и

> Как реализовать optimistic locking?

обычно отвечаются вместе.

------

# Если цель — Middle

Я бы сделал примерно такой рейтинг покрытия.

| Тема          | Покрытие |
| ------------- | -------- |
| Fetching      | 100%     |
| Lifecycle     | 95%      |
| Cache         | 90%      |
| Relationships | 90%      |
| Locking       | 90%      |
| JPQL          | 80%      |
| EntityManager | 80%      |
| Inheritance   | 70%      |
| Transactions  | **20%**  |
| Performance   | **60%**  |
| Mapping       | **60%**  |

**Общая оценка:** **78–82%**.

Если добавить следующие темы:

- Persistence Context;
- flush vs commit;
- `@Transactional` и связь с `Session`/`EntityManager`;
- Open Session In View (OSIV);
- `equals()`/`hashCode()` для Entity;
- `mappedBy` и owning side;
- EntityGraph;
- генерация идентификаторов (`GenerationType`);
- Hibernate Proxy;
- DTO vs Entity;

то покрытие вырастет примерно до **95–97%** типового набора вопросов по Hibernate/JPA для уровня Middle. На Senior дополнительно часто обсуждают внутреннее устройство Hibernate (Action Queue, механизм dirty checking, bytecode enhancement, batching, статистику Hibernate, тонкую настройку производительности и кэширования).