- Неплохой практический пример взял из своей практики, чтобы продемонстрировать проблему



```java
@Service
@RequiredArgsConstructor
public class SendClaimService {

    private final ClaimRepository claimRepository;
    private final JdbcTemplate jdbcTemplate;

    public Long sendClaim(long userId, String firstname, String lastname, String message) {
        String claimMessage = "Заявка от " + firstname + " " + lastname + ": " + message;

        Long claimId = saveClaim(userId, claimMessage);
        Long absClaimId = null;
        String status = null;

        try {
            absClaimId = jdbcTemplate.queryForObject(
                "select send_claim(?) from dual",
                Long.class,
                claimMessage
            );

            status = "sent";
        } catch (DataAccessException ex) {
            status = "sending_error";
        }

        updateClaim(claimId, absClaimId, status);

        return claimId;
    }

    @Transactional
    private Long saveClaim(long userId, String claimMessage) {
        var claim = new Claim();
        claim.setUserId(userId);
        claim.setMessage(claimMessage);
        claim.setStatus("new");

        return claimRepository.save(claim).getId();
    }

    @Transactional
    private void updateClaim(Long claimId, Long absClaimId, String status) {
        var claim = claimRepository.findById(claimId).orElseThrow();
        claim.setAbsId(absClaimId);
        claim.setStatus(status);
    }

}
```





# Дипси ответил

- Вот что ответил дипси на эту тему, разобраться про OSIV и оформить вместе с примеров в стиле статьи

Хороший вопрос! Дело в том, что `@Transactional` на **private** методах в Spring **вообще не работает** — но не из-за self-invocation, а потому что Spring AOP (по умолчанию через CGLIB proxy) не может проксировать private-методы.

Однако в вашем коде транзакции всё-таки сработали. Причины:

## 1. `claimRepository.save()` сам по себе транзакционный

`SimpleJpaRepository.save()` помечен `@Transactional`. Даже если ваш `saveClaim()` не обёрнут в транзакцию, `save()` откроет свою собственную (по умолчанию `REQUIRED` — создаст новую, т.к. внешней нет). То же самое с `findById()` — `SimpleJpaRepository` помечен `@Transactional(readOnly = true)`.

Поэтому:
- `claimRepository.save(claim)` — коммитит внутри своей транзакции ✅
- `claimRepository.findById(claimId)` — работает в read-only транзакции, но `claim.setStatus(...)` при этом **не сохраняется явно** через `save()`, но...

## 2. Dirty checking всё равно работает — но не всегда

Тут важно: `findById()` возвращает **managed entity** только если вы находитесь внутри активной persistence context (транзакции или open-session-in-view).

- Если у вас включён **OSIV** (`spring.jpa.open-in-view=true`, по умолчанию `true`) — EntityManager открыт на весь HTTP-запрос. Тогда `findById()` возвращает managed entity, и изменения попадут в БД при flush/commit.
- Если OSIV выключен — без `@Transactional` на `updateClaim()` изменения **не сохранятся**, потому что транзакции `findById()` (readOnly) уже закрылись к моменту `setStatus()`.

## 3. Почему self-invocation здесь не «кусается»

Self-invocation ломает транзакции, когда **внешний** метод НЕ транзакционный, а **внутренний** — транзакционный, и вызов идёт через `this.`. У вас `sendClaim()` не транзакционный — значит общей транзакции и не должно было быть.

Но так как:
- `save()` сам открывает транзакцию,
- `findById()` + OSIV дают managed entity,

...всё «случайно» работает.

## Как проверить

1. Выключите OSIV: `spring.jpa.open-in-view=false` — и `updateClaim` перестанет сохранять изменения (или будете ловить `LazyInitializationException`).
2. Поставьте точку останова или логирование `TransactionSynchronizationManager.isActualTransactionActive()` внутри методов — увидите, что они выполняются **не** в одной транзакции, а в разных.

## Как правильно

Вынести транзакционные методы в отдельный бин или сделать `sendClaim` транзакционным:

```java
@Transactional
public Long sendClaim(...) { ... }  // тогда всё в одной транзакции

// а saveClaim/updateClaim сделай public/package-private и вызывай через self-injection
// или просто сделай их частью sendClaim без отдельных @Transactional
```

И помнить: **`@Transactional` на private-методах — no-op**, независимо от self-invocation.