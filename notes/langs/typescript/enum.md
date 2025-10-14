---
title: "enum"
layout: default
parent: "TypeScript"
---



 🛠️ в процессе разработки, требует сильных правок 🛠️

# Карта

- Перечисления - enum
  - Принято называть в единственном числе. Например, `Direction` а не `Directions`
  - [Виды enum](#виды-перечислений)
    - Числовые (дефолт)
      - Совместимы с типом int
      - [Обратный маппинг](#обратный-маппинг)
    - Строковые
      - Совместимы с типом string
- Получение значений перечисления
  - Конкретного значения
    - Прямой доступ - по имени элемента получаем его значение
  - Всех значений
    - Полезно для проверок данных, пришедших извне
- [enum существуют в рантайме](#enum-в-рантайме)
- const enum
- Альтернатива enum через typeof + keyof + as const





# Объявление enum

```typescript
enum SelectionType {
  Repository,
  CloningRepository,
  MissingRepository,
}

const repoType: SelectionType = SelectionType.Repository;
```

- Repository, CloningRepository, MissingRepository - это **имена** элементов перечисления
- 0, 1, 2 - это **значения** элементов перечисления. В данном случае числовые неявные

# Виды перечислений

## Числовые

Если не задать значения для элементов перечисления, то значениями станут числа:

```typescript
enum Direction {
  Up,     // = 0,
  Right,  // = 1,
  Down,   // = 2,
  Left    // = 3
}
```

## Строковые

Значение - строка:

```typescript
enum Direction {
  North = "Север",
  East  = "Восток",
  South = "Юг",
  West  = "Запад"
}
```



# Совместимость enum

## Совместимость со string и number

* Числовые enum <=> number
* Строковые enum <=> string

```typescript
enum Direction { Up = "Вперед", Down = "Назад" }
enum Speed { Slow = 10, Fast = 100, UltraFast = 1000 }

function test(direction: string, speed: number) {
  console.log("Выбранное направление: " + direction);
  console.log("Скорость: " + speed);
}

test(Direction.Up, Speed.Fast);  // <-- Ok, enum вместо строки и числа.
```

## Совместимость с Object

enum в рантайме представляет собой объект. Элементы перечисления являются полями этого объекта. Поэтому само перечисление может оказаться совместимо с объектом, у которого похожая структура:

```typescript
enum Direction {
  Up = "Вверх",
  Down = "Вниз",
  Left = "Влево",
  Right = "Вправо"
}

function foobar(arg: { Up: string }) {
  console.log(arg.Up);
}

foobar(Direction);  // <-- "Вверх"
```



# Обратный маппинг

- Если перечисление числовое, тогда по значению можно получить имя элемента
  - Это называется **обратный маппинг**
- Для строковых перечислений обратный маппинг не работает

```typescript
enum Direction {
  Up,     // = 0
  Right,  // = 1
  Down,   // = 2  
  Left    // = 3
}

console.log(Direction[0]); // "Up" - обратный маппинг
console.log(Direction.Up); // 0 - прямой доступ
```





# Получение значения перечисления

```typescript
enum Direction {
  North = "Север",
  East = "Восток",
  South = "Юг",
  West = "Запад"
}
```

## Получение одного значения

По имени элемента получаем значение (называется **прямой доступ**):

```typescript
console.log(Direction.North);  // Север
```

## Получение всех значений

```typescript
const directions: Direction[] = Object.values(Direction);
console.log(directions);  // ["Север", "Восток", "Юг", "Запад"]
```

Это может понадобиться для различных проверок, когда данные приходят в программу извне и могут быть неправильными:

```typescript
// Данные извне (API, форма, URL-параметры)
const userInput: string = req.query.direction;  // "Север" или "Левый"

function isValidDirection(input: string): boolean {
  return Object.values(Direction).includes(input as Direction);
}

if (isValidDirection(userInput)) {
  const direction = userInput as Direction; // ✅ Теперь безопасно
}
```



# enum в рантайме

- enum существуют в рантайме в виде объектов в памяти
- tree-shaking их не удаляет, даже если они не используются в коде
- Поэтому перечисления немного увеличивают итоговые размеры бандла

# Альтернатива enum'у

## union

```typescript
type SideValues = "Юг" | "Север" | "Восток" | "Запад";

function printSide(side: SideValues): void {
  console.log(side);
}

printSide("Юг");
```

Чтобы не писать от руки значения при передаче, есть еще подход через константный объект.

## Константный объект

Ахтунг! Сложна! P.S. См конспект по typeof и keyof, если вдруг не понятно, как они работают в своей основе:

```typescript
const SideValues = {  // <-- Альтернатива enum'у
  South: "Юг",
  North: "Север",
  East: "Восток",
  West: "Запад"
} as const;

type SideValuesType = typeof SideValues;  // <-- Получаем тип константного объекта.
/*
  type sideType = {
      readonly South: "Юг";  // <-- Надо создать union-тип из этих литералов (Юг, Север и т.д.)
      readonly North: "Север";  // Он заменит нам перечисление на местах.
      readonly East: "Восток";  // <-- Восток - это не значение, это тип-литерал!
      readonly West: "Запад";
  }
*/
// <-- Сначала получаем union из имен полей типа:
type unionTypeFromKeyNames = keyof SideValuesType;  // "South" | "North" | "East" | "West"
// <-- А теперь с его помощью добираемся до типов-литералов:
type Side = SideValuesType[unionTypeFromKeyNames];  // "Юг" | "Север" | "Восток" | "Запад"
// Все, используем Side на местах вместо перечисления.

type SV = typeof SideValues[keyof typeof SideValues];  // То же самое, только в одну строчку.

// А так бы это выглядело, если написать это вручную
type SV2 = typeof SideValues["North" | "South" | "East" | "West"];
// Синтаксис выше - то же самое что
type SV3 = SideValuesType["North"] | SideValuesType["South"]  |
           SideValuesType["East"]  | SideValuesType["West"];

function printSide(side1: Side, side2: SV, side3: SV2, side4: SV3): void {
  console.log(side1);
  console.log(side2);
  console.log(side3);
  console.log(side4);
}

printSide(SideValues.East, SideValues.North, SideValues.West, SideValues.South);
```

Работает это примерно так:

* В основе лежит тот факт, что если объект константный, то значения его полей не могут изменяться. Значит типы этих полей представляют собой типы-литералы, т.е. не string, а "Север", "Юг" и т.д..

  * Стоит однако помнить, что этот литерал не является ЗНАЧЕНИЕМ, это именно тип с единственно возможным значением, поэтому и работать с ним можно только как с типом.

* Так что если мы делаем `typeof SideValues["North"]` , то получаем тип-литерал `Север`

  * Выражение

    ```typescript
    typeof SideValues["North" | "South" | "East" | "West"];
    ```

    это то же самое, что написать вот так:

    ```typescript
    SideValuesType["North"] | SideValuesType["South"] | SideValuesType["East"]  | SideValuesType["West"];
    ```

  * Таким образом мы достаем каждый литерал и формируем новый union-тип, собранный из отдельных литералов "Север", "Юг" и т.д.

* Сохранив его под самостоятельным псевдонимом, можем использовать его в местах, где нам потребовалось бы перечисление. А для удобного выбора значений используем константный объект.





```typescript
type T1Direction = {
  Up: string,
  Down: string,
  Left: string,
  Right: string
};

type T2Direction = {
  Up: "UP",
  Down: "DOWN",
  Left: "LEFT",
  Right: "RIGHT"
};


const Direction = {
  Up: "UP",
  Down: "DOWN",
  Left: "LEFT",
  Right: "RIGHT",
} as const;

// type Direction = typeof Direction[keyof typeof Direction]; // "UP" | "DOWN" | "LEFT" | "RIGHT"
// фишка в том, что сначала идет typeof Direction, а потом Indexed Types Acceess, тогда все становитмся ясно
type Direction = typeof Direction['Up' | 'Down' | 'Left' | 'Right'];

function move(dir: Direction) {
  console.log(dir);
}

move(Direction.Up); // OK
move("UP"); // OK, так как Direction = "UP" | "DOWN" | ...
// move("INVALID"); // Ошибка: Argument of type '"INVALID"' is not assignable to type 'Direction'.
```



