# Redis

## Модель хранения данных

- Redis - это in-memory хранилище, т.е. все данные хранятся в RAM и основная работа идет в RAM
  - За счет этого высокая скорость, поэтому хорошо подходит для кэширования
- Редис может сохранять данные на диск
  - За счет этого он может восстановить данные после перезапуска
- Данные хранятся в формате `key : value`
  - value хранится в виде одного из типов редиса
- Основные типы данных редиса
  - String → кэш объекта / токен / число
  - Hash → объект с полями (user profile)
  - List → очереди / ленты
  - Set → уникальные коллекции
  - ZSet → рейтинги, топы, лидерборды
- Никакой группировки хранимых значений в редисе нет - все данные хранятся в едином плоском пространстве
  - Группировку можно сделать только искуственно, например
    - использовать префиксы, например users::1, чтобы потом фильтровать ключи по `users::`
    - остальное - маргинальное

## TTL

- `TTL` - Time To Live, это "время жизни" ключа, после которого он считается просроченным
  - TTL это характеристика, привязанная именно к ключу
- TTL можно задать двумя стилями
  - `relative expiration` - "Длительность жизни" (например, ключ живет 60 секунд)
  - `absolute expiration` - "Момент смерти" (конкретный момент времени)
- TTL опирается на системное время. Т.е. если часы на сервере сбились, это влияет
- TTL тикает сам по себе, он не зависит от обращений к ключу (как будто очевидно, но пусть будет)
- Момент удаления истекшего ключа
  - Истекший ключ продолжает висеть в памяти
    - Если к нему обращаются, то редис отвечает клиенту, что такого ключа нет и удаляет этот ключ
    - Периодически редис сам удаляет истекшие ключи
  - Т.о. в редисе гибридная модель удаления - периодическая авто-проверка ключей на истекание и очистка + удаление при обращении к истекшему ключу

## eviction policy

- `Eviction policy` - это модель вытеснения (удаления) ключей, когда наступают лимиты хранения
  - Память заканчивается и чтобы сохранять новые ключи, надо принять решение - какие из уже хранящихся ключей удалить











# Docker

```yaml
services:
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: unless-stopped

  redisinsight:
    image: redis/redisinsight:latest
    container_name: redisinsight
    ports:
      - "5540:5540"
    volumes:
      - redisinsight-data:/data

volumes:
  redis-data:
  redisinsight-data:
```





# Админка

```
http://localhost:5540/
```

- Адрес редиса добавлять через имя сервиса в докере 
  - Это стоит как пример `redis://default@127.0.0.1:6379`, меняем на `redis://default@redis:6379` - после @ ставим имя сервиса из докера





# Зависимости

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
```







# Базовый пример

## application.yaml

```yaml
spring:
  cache:
    type: redis
  redis:
    host: localhost # (или redis если приложение тоже в докере запущено)
    port: 6379
```



## Активация кэширования в приложении

- `@EnableCaching` - вешаем на все приложение

```java
@EnableCaching
@SpringBootApplication
public class UserApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserApplication.class, args);
	}

}
```



## Кэширование результата метода

- `@Cacheable(настройки)` - вешаем на методы, результат которых хотим кэшировать

```java
@Cacheable(value = "users", key = "#userId")
public List<FavoriteProductDto> getUserFavorites(Long userId) {
    // ...
}
```



## Инвалидация кэша после выполнения метода

- Когда после выполнения метода надо не закэшировать результат, а инвалидировать кэш. Например, добавили новый товар в избранное, значит надо для этого юзера кэш инвалидировать, чтобы при запросе избранного не получить старый кэш, без нового товара, а чтобы отправился новый запрос и вернулся актуальный список избранного и вновь заполнил кэш.

```java
@CacheEvict(value = "userfavorites", key = "#userId")
public void addToFavourites(long userId, long productId) {
    boolean userExists = userRepository.existsById(userId);

    if (!userExists) {
        throw new RuntimeException("Пользователь не существует");
    }

    boolean productExists = productStub.checkExists(
        ProductIdRequest.newBuilder().setProductId(productId).build()
    ).getExists();

    if (!productExists) {
        throw new RuntimeException("Товар не существует");
    }

    var favorite = new Favorite(userId, productId);
    favoritesRepository.save(favorite);
}
```





## Сериализатор

- Сохраняемый объект всегда проходит через сериализацию перед отправкой в редис

```
User
 ↓
Serializer
 ↓
byte[]
 ↓
Redis
```

- Сериализуются не только сложные объекты, но и строки, числа, в общем, все
- Если явно не указать сериализатор, спринг сам выберет что-то дефолтное
  - Допустим в Java это будет JDK Serializer



## Настройка сериализатора

- Все настройки кэширования задаются через `RedisCacheManager`
- Создаем бин этого типа

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

import java.time.Duration;

@Configuration
public class RedisConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new Jackson2JsonRedisSerializer<>(Object.class)));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(config)
                .build();
    }
}
```





# Детали

## @Cacheable

- `@Cacheable(value = "users", key = "#userId")`
  - `key` - это SPeL-выражение, которое получает значение из параметра метода. Например, если вызвать getUserFavorites(5), то key получит значение 5
  - `value` - это префикс для ключа
  - итоговый ключ, который уйдет в редис, будет выглядеть как `value::key`, например `users::5` в данном примере
    - :: это стандарный разделитель в spring data redis. Такой формат используется потому что в редисе все ключи хранятся в едином пространстве и чтобы как-то их искусственно разделить, используются префиксы
- Можно задать `value` один раз - через `@CacheConfig(value = "users")` на классе
  - Тогда в каждом методе пишем только `@Cacheable(key = "#userId")`







# Проблемы

## Сериализация

### Ошибки сериализации при JDK Serializer

- До того как я настроил JSON-сериализацию, кэширование вызывало ошибку (хз какую, просто не работало, программа ложилась)
- Решение
  - Кэшируемый класс должен `implements serializable`
    - Это важно конкретно для JDK Serializer



