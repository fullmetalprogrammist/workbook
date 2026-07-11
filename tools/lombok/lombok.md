# Констукторы

## @RequiredArgsConstructor

### Для внедрения зависимостей

```java
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;
    private final EmailClient emailClient;
}
```

- `@RequiredArgsConstructor` генерирует конструктор для всех final-полей
- За счет чего работает?
  - Если конструктор только один, тогда на него не требуется вешать @Autowired, спринг сам использует его для инъекции







# Билдеры

