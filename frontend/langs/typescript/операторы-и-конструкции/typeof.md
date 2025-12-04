# Карта

- `typeof ЗНАЧЕНИЕ -> ТИП | строка`
- Отличия typeof в JavaScript и TypeScript
  - [JavaScript](#typeof-в-javascript)
    - typeof всегда возвращает *строку*
  - TypeScript
    - Что вернет typeof - зависит от контекста использования
      - ["Контекст выражений"](#контекст-выражений)
        - Возвращает строку
      - ["Контекст типов"](#контекст-типов)
        - Возвращает тип
    - Поэтому при использовании typeof надо всегда осознавать контекст
- [Как выглядит тип](#как-выглядит-тип)
  - Если тип структурный, то можно представить его себе как объект, где вместо значений полей - их типы, как будто мы просто их написали бы сами при `type Person = { name: string; age: number }`
  - Если тип примитивный \ специальный, вроде string \ any то не знаю, какую ментальную модель предложить) Просто представить как "тип"
- [Проверка на тип](#проверка-на-тип)
  - Проблема проверки через ===
    - Она бесполезна для *типов*, она годится только для выражений
  - Что делать, как проверять ts-типы?
    - Разные подходы
      - Паттерн Type Guard - для простых случаев
      - Валидаторы, схема - zod, yup - для сложных случаев
      - Возможно, есть что-то еще





# typeof в JavaScript

Всегда возвращает строку:

```javascript
const person = "Tom Sawyer";
const typeOfPerson = typeof person;  // "string" - строка
```

```javascript
const person = {
  name: "Tom Sawyer",
  age: 14
}
const typeOfPerson = typeof person;  // "object" - строка
```

Т.е. результатом оператора является *строка*, которая характеризует тип. Из-за того что это строка, т.е. обычное значение, можно применять typeof например в условиях:

```javascript
if (typeof person === "object") {
  // что-то делаем
}
```





# typeof в TypeScript

## Контекст использования

### Контекст выражений

Это места, где ожидается значение, например:

- В условиях

```typescript
const tom = {
  name: "Tow Sawyer",
  age: 14
}

if (typeof tom === "object") {
  console.log("Тип переменной tom - это объект");
}
```

В таких местах typeof возвращает строку, так же как и в js. Но это работает только для js-типов. Грубо говоря, нельзя проверить на `=== "any"` или `=== "Person"`, потому что эти типы существуют только на этапе компиляции, а if работает в рантайме, где уже нет никаких ts-типов.



### Контекст типов

Это значит в местах, где ожидается тип, например:

- В месте указания типа

```typescript
const tom = {
  name: "Tow Sawyer",
  age: 14
}

const huck: typeof tom = {  // <-- Тут ожидается тип
  name: "Huck Finn",
  age: 15
}
```

- В объявлении типа через type

```typescript
const tom = {
  name: "Tow Sawyer",
  age: 14
}

type Person = typeof tom;  // <-- Тут ожидается тип

const huck: Person = {  
  name: "Huck Finn",
  age: 15
}
```

В таких местах typeof возвращает тип, а не строку.







# Как выглядит тип

```typescript
          const person = {               {  // Тип
typeof      name: "Tom Sawyer",   -->      name: string;
            age: 14                        age: number;
          }                              }
```

Еще несколько базовых технических примеров:

```typescript
let person;
type t = typeof person;  // any
// Тип не указан, значения нет, значит любой
```

```typescript
let person: string;
type t = typeof person;  // string
// string - это не строка "string", а именно тип string
```

```typescript
let person = "Huck Finn";  // из-за let
type t = typeof person;  // string
```

```typescript
const person = "Huck Finn";  // из-за const
type t = typeof person;  // литеральный тип "Huck Finn"
```



# Проверка на тип

## Проблема проверки через ===

Написать вот так - нельзя:

```typescript
type Person = {
  name: string;
  age: number;
}

const tom: Person = {
  name: 'Tom Sawyer',
  age: 14
}

if (typeof tom === Person) {  // ❌ 'Person' only refers to a type, but is being used as a value here
  console.log('tom is Person');
}
```

Тип Person существует только во время компиляции, в рантайме его нет, поэтому выражение `if (typeof tom === Person)` неправомерно. То же самое относится и ко всем остальным типам - any, unknown. Т.е. проблема заключается в том, что нельзя в условии использовать непосредственно *тип*, потому что ожидается значение, а тип значением не является.

Можно было бы написать вот так:

```typescript
if (typeof tom === "object") {
  console.log('tom is object');
}
```

Но это фактически означает спуститься до уровня JavaScript.









