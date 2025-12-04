# Карта

- class - это ключевое слово, а не оператор
- Объявление класса
- Конструктор
  - Конструктор может быть только один. Если нужно несколько, тогда:
    - Перегрузка конструктора
      - Сценарий "есть \ нет аргумента"
      - Сценарий "аргументы и их типы разношерстные"
    - Фабричные методы - предпочтительнее, т.к. нагляднее и проще поддерживать
- Свойства (поля)
  - В TypeScript поля класса нужно обязательно описать в теле класса
  - Значения по умолчанию для полей
    - Тип при этом можно не указывать - вычислится автоматически из значения
  - Автоматические свойства (parameter properties)
    - Компилятор создает свойства класса автоматически, если указать модификаторы public, protected, private, readonly рядом с параметром конструктора
  - "Оператор доверия"
    - definite assignment assertion operator `!`
    - Когда поле не инициализировано ни по умолчанию, ни в конструкторе, потому что инициализация планируется позже (например, ленивая инициализация)
- Методы
- Модификаторы видимости
  - public
  - protected
  - private
- Наследование
- Геттеры, сеттеры



# Объявление класса

```typescript
class Person {
  
}
```



# Конструктор

В TS так же как и в JS у класса может быть только один конструктор. Для создания экземпляра через разное количество параметров можно реализовать например так:

* Перегрузить конструктор.
* Написать несколько фабричных функций, каждая с нужным количеством параметров.
  * Предпочтительнее, потому что нагляднее и проще поддерживать.

## Перегрузка конструктора

Конструктор может быть только один, но его можно перегрузить, так же как и функцию.

### Сценарий 1 - переменное число аргументов

Эта реализация подходит для сценариев, когда вопрос стоит как "есть \ нет аргумента".

Например, при регистрации где-нибудь человек должен ввести, как к нему обращаться. Имя - обязательно, фамилия - по желанию, отчество - не обязательно, т.к. не у всех есть отчество:

```typescript
class Person {
  name: string;        // имя (обязательное)
  surname?: string;    // фамилия (опционально)
  patronymic?: string; // отчество (опционально)

  // Перегрузки конструктора
  constructor(name: string);
  constructor(name: string, surname: string);
  constructor(name: string, surname: string, patronymic: string);
  constructor(name: string, surname?: string, patronymic?: string) {
    this.name = name;
    this.surname = surname;
    this.patronymic = patronymic;
  }

  getFullName(): string {
    return [this.surname, this.name, this.patronymic]
      .filter(Boolean)
      .join(" ");
  }
}

// Примеры использования:
const ivan = new Person("Иван", "Петров", "Сергеевич");
console.log(ivan.getFullName()); // Петров Иван Сергеевич

const anna = new Person("Анна", "Сидорова");
console.log(anna.getFullName()); // Сидорова Анна

const smith = new Person("Дмитрий");
console.log(smith.getFullName()); // Дмитрий
```

### Сценарий 2 - аргументы очень разные

Эта реализация подходит для сценариев, когда вопрос не просто "есть \ нет аргумента", а количество аргументов и их типы очень разношерстное и логика создания объекта зависит от типов:

```typescript
class Vector {
  x: number;
  y: number;

  constructor();
  constructor(x: number, y: number);
  constructor(vector: Vector);
  constructor(coords: [number, number]);
  constructor(...params: [] | [number, number] | [Vector] | [[number, number]]) {
    if (params.length === 0) {
      this.x = 0;
      this.y = 0;
    } else if (params.length === 2) {
      this.x = params[0];
      this.y = params[1];
    } else if (params[0] instanceof Vector) {
      this.x = params[0].x;
      this.y = params[0].y;
    } else if (Array.isArray(params[0])) {
      this.x = params[0][0];
      this.y = params[0][1];
    } else {
      throw new Error("Invalid arguments for Vector constructor");
    }
  }
}

// Использование:
const v1 = new Vector();           // (0, 0)
const v2 = new Vector(1, 2);       // (1, 2) 
const v3 = new Vector(v2);         // копия v2
const v4 = new Vector([3, 4]);     // из массива
```

Объяснения:

- Почему не проверяется на `params.lentght === 1` в последних ветках?
  - Потому что заданный тип `...params: [] | [number, number] | [Vector] | [[number, number]]` уже подразумевает, что длина может быть либо 0, либо 2, либо 1. На 0 и 2 мы проверили, значит во всех ветках уже точно 1. Если будет 3, то ts просто не скомпилирует программу.

## Фабричные методы

Мы можем создать несколько *статических* методов, каждый с нужным количеством параметров, и создавать экземпляры в них:

```typescript
class Vector {
  x: number;
  y: number;

  // Приватный конструктор - создаем только через фабричные методы
  private constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  // Фабричные методы
  static zero(): Vector {
    return new Vector(0, 0);
  }

  static fromCoordinates(x: number, y: number): Vector {
    return new Vector(x, y);
  }

  static fromVector(other: Vector): Vector {
    return new Vector(other.x, other.y);
  }

  static fromArray(coords: [number, number]): Vector {
    return new Vector(coords[0], coords[1]);
  }
}

// Использование:
const v1 = Vector.zero();                 // (0, 0)
const v2 = Vector.fromCoordinates(1, 2);  // (1, 2)
const v3 = Vector.fromVector(v2);         // копия v2
const v4 = Vector.fromArray([3, 4]);      // из массива

console.log(v1); // Vector { x: 0, y: 0 }
console.log(v2); // Vector { x: 1, y: 2 }
console.log(v3); // Vector { x: 1, y: 2 }
console.log(v4); // Vector { x: 3, y: 4 }
```

Можно комбинировать - простые случаи через конструктор, более сложные - через фабричные методы:

```typescript
class Vector {
  x: number;
  y: number;

  // Простой конструктор только для основных координат
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  // Фабричные методы для специальных случаев
  static fromVector(other: Vector): Vector {
    return new Vector(other.x, other.y);
  }

  static fromArray(coords: [number, number]): Vector {
    return new Vector(coords[0], coords[1]);
  }
}

// Использование:
const v1 = new Vector();        // (0, 0)
const v2 = new Vector(1, 2);    // (1, 2)
const v3 = Vector.fromVector(v2); // копия
const v4 = Vector.fromArray([3, 4]); // из массива
```



# Свойства (поля)

## Объявление полей в классе

* В отличие от JS, в TS надо обязательно описывать поля в теле класса.
* Если не указать тип, по умолчанию будет any.

```typescript
class Person {
  firstname: string;  // <-- Поля обязательно надо описать в теле класса
  lastname;  // <-- Тип не указан - будет any

  constructor(firstname: string, lastname: string) {
    this.firstname = firstname;
    this.lastname = lastname;
  }
}
```

То, что мы указали тип для lastname в конструкторе - не важно. Все равно поле lastname будет типа any.



## Значения по умолчанию

- Можно задать полю значение по умолчанию
- Тип при этом можно не указывать - он вычислится автоматически на основе значения

```typescript
class Person {
  firstname: string = "Tom";  // <-- Зададим значения по умолчанию
  lastname = "Sawyer";  // <-- Тип указывать не обязательно, когда даем дефолтное значение

  constructor(firstname?: string, lastname?: string) {
    if (firstname) this.firstname = firstname;  // <-- Если передано, переназначим
    if (lastname) this.lastname = lastname;
  }
}

const p = new Person();  // <-- У firstname и lastname будут значения по умолчанию
console.log(p.firstname);  // Tom
console.log(p.lastname);   // Sawyer

const sid = new Person("Sid");  // <-- lastname останется по умолчанию
console.log(sid.firstname);  // Sid
console.log(sid.lastname);   // Sawyer
```



## Автоматические свойства (parameter properties)

Если объявить параметры конструктора с модификатором, то компилятор автоматически создаст поля класса под эти параметры и присвоит в них значения.

Можно использовать любой модификатор из:

- public, protected, private или readonly
- Комбинацию, например public readonly

```typescript
class Person {
 // Не надо описывать поля
    
  public constructor(public readonly name: string, public readonly surname: string) { 
    // Присваивать руками не надо - значения присвоятся полям автоматически
  }

  public info() {
    console.log(this.name + " " + this.surname);
  }
}

const person = new Person("Huck", "Finn");
person.info();  // Huck Finn

```



## "Оператор доверия", конструкция !

Если не указать значение по умолчанию и не присвоить значение полю в конструкторе, то компилятор выдаст ошибку "Property has no initializer and is not definitely assigned in the constructor."

Можно отключить проверку инициализации опцией компилятора `"strictPropertyInitialization": false`.

Если мы намеренно не заполняем значение по умолчанию или в конструкторе, потому что например значение должно заполниться как-то еще позже, то можем использовать синтаксическую конструкцию `!` (называется *definite assignment assertion operator*) на таком поле:

```typescript
class Person {
  age!: number;  // <-- Поле не заполняется ни по дефолту, ни в конструкторе
}
```

> Хотя в названии есть слово operator, фактически это не оператор, а конструкция. Она служит лишь подсказкой компилятору и в рантайме не существует.

Реалистичный пример, когда это может быть полезно: ленивая инициализация. Мапу под обработчики создаем лишь когда идет попытка добавить обработчик впервые:

```typescript
class EventEmitter {
  private listeners!: Map<string, Function[]>;  // Ленивая инициализация
  
  addListener(event: string, callback: Function) {
    if (!this.listeners) {
      this.listeners = new Map();  // Инициализируем при первом использовании
    }
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }
  
  emit(event: string, data: any) {
    if (!this.listeners) return;
    this.listeners.get(event)?.forEach(callback => callback(data));
  }
}
```



## readonly-поля TODO

* Поля только для чтения объявляются модификатором `readonly`.
* Их можно инициализировать либо по умолчанию, либо в конструкторе и больше нигде.

```typescript
class Person {
  firstname: string;
  lastname: string;
  readonly race: string = "Humanoid";  // <-- readonly, можно дать значение по умолчанию.

  constructor(firstname: string, lastname: string) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.race = "Human";  // <-- Или заполнить в конструкторе.
  }

  foobar(): void {
    this.firstname = "none";
    this.lastname = "empty";
    this.race = "Lizard";  // <-- Ошибка: Cannot assign to 'race' because it is a read-only property.
  }
}
```

## static поля TODO

TODO: Мб static-поля и методы можно в отдельный конспект сделать, тк там наверное одно и то же?