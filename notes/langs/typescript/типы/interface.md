---
title: "interface"
layout: default
parent: "Типы TS"
nav_order: 400
---



<h1>Оглавление</h1>
- TOC
{:toc}




# Карта

- interface - это ключевое слово, а не оператор
- Объявление интерфейса
- Что может входить в интерфейс
  - Свойства и методы. Концептуально интерфейс чаще всего это данные + поведение
- Модификатор видимости - всегда public (по умолчанию, писать явно не надо и нельзя)
- Наследование интерфейсов
  - Ключевое слово extends
- Реализация интерфейса
  - Объектом
    - Должен строго иметь только поля и методы из интерфейса, добавить другие нельзя
  - Классом
    - Ключевое слово implements
    - Можно добавить дополнительные поля и методы
- **🛠️** Слияние интерфейсов





# Объявление интерфейса

Интерфейс может содержать:

* Свойства.
* Методы.

```typescript
interface Person {
  name: string;  // <-- Свойство
  hello(): void;  // <-- Метод
}
```

Статистически, 60% интерфейсов содержат данные + методы, 30% - только данные, 10% - только методы.

# Модификаторы видимости

* Все члены интерфейса по умолчанию считаются public и писать это явно не надо (и нельзя).
* Никакие другие модификаторы видимости не допускаются.

```typescript
interface Person {
  public firstname: string;  // <-- Ошибка: 'public' modifier cannot appear on a type member.
  private lastname: string;  // <-- Ошибка: 'private' modifier cannot appear on a type member.
  hello(): void;  // <-- Метод public по умолчанию и писать это специально не надо и нельзя.
}
```



# Наследование интерфейсов

Ключевое слово `extends`:

```typescript
interface IFoo extends IBar {
  // Описание интерфейса
}
```



# Реализация интерфейса

## Объектом

* Объект должен содержать строго все поля и методы, которые есть в интерфейсе, *не больше и не меньше*.
* Добавить в объект дополнительные поля или методы - нельзя, будет ошибка.

```typescript
interface Person {
  firstname: string;
  lastname: string;
  fullname(): string;
  hello(): void;
}

const tom: Person = {  // <-- Для реализации у объекта дб все поля и методы интерфейса.
  firstname: "Tom",
  lastname: "Sawyer",
  fullname() {
    return `${this.firstname} ${this.lastname}`;
  },
  hello() {
    console.log(`Hello! My name is ${this.fullname()}.`);
  }
};

tom.hello();
```

## Классом

* Ключевое слово `implements`
* Класс должен иметь все поля и методы, которые есть в интерфейсе.
* Можно добавить в класс дополнительные поля и методы.

```typescript
interface Person {
  firstname: string;
  lastname: string;
  hello(): void;
};

class Character implements Person {  // <-- implements, реализуем интерфейс.
  firstname: string;  // <-- Дб все поля и методы из интерфейса.
  lastname: string;
  nickname: string;  // <-- И можно добавить дополнительные поля.

  constructor(firstname: string, lastname: string) {
    this.firstname = firstname;
    this.lastname = lastname;
  }

  hello() {
    console.log(`Hello! My name is ${this.fullname()}.`);
  }

  private fullname() {  // <-- Можно добавить дополнительные методы, это не ошибка.
    return `${this.firstname} ${this.lastname}`;
  }
}

const huck = new Character("Huck", "Finn");

huck.hello();
```



# Слияние интерфейсов

Если объявить интерфейс с одним и тем же именем несколько раз, то оба описания сольются, и в итоговом интерфейсе окажутся члены из обоих описаний.

Это называется *declaration merging*. Работает только если объявление интерфейсов находится в одном модуле. Если импортировать интерфейс в другой модуль и попробовать объявить еще один интерфейс с таким же именем, тогда будет конфликт имен, а не объединение.

TODO: тема затрагивает .d.ts файлы, способы расширения чужих типов. Сходу расписать нормально сложно, вернуться позже.

