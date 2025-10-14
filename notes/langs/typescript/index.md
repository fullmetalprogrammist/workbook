---
title: "TypeScript"
parent: "Языки"
layout: default
---

<h1>Оглавление</h1>
- TOC
{:toc}


# Типы данных, обзор

## Принципы типизации

- [Принципы типизации](принципы-типизации)
  - Структурная типизация
  - Явное указание типа \ автоопределение типа
  - Типы существуют только в момент компиляции, в рантайме их нет
    - Исключение - enum

## Классификация типов

- Базовые типы
  - Такие же как в JavaScript
    - Примитивные
      - number, bigint, string, boolean, null, undefined, symbol
    - Не примитивные
      - object, обертки для примитивов (Number, BigInt, String, Boolean, Symbol - с больших букв)
- Специальные типы
  - [any, unknown, never, void](any-unknown-never-void)
- Типы на основе значений
  - [Литеральный тип ("литерал")](литеральный-тип)
- Объектные типы
  - [type](type)
  - [interface](interface)
  - [class](class)
  - Дополнительные темы
    - [type vs interface](type-vs-interface)
- Перечисляемые типы
  - [enum](enum)



# Работа с типами

## Синтаксические конструкции

- Синтаксическая конструкция as const (не является оператором)
- Синтаксическая конструкция Indexed Acces Type

## Операторы

- Операторы typeof и keyof
- Оператор in
- [Объединение (union оператор)](union-оператор)

## Практические паттерны

- Типизация при деструктуризации



# Utility-типы

- utility-типы
  - Характеристики utility-типов
    - Используют дженерики
      - На основе указанного типа создают новый тип в месте использования
  - Обзор типов
    - Partial + Required
    - Pick + Omit
    - Extract + Exclude
    - Readonly
    - InstanceType
    - Record



# Типы коллекций

- Array
- ReadonlyArray
- Tuple



# Функции

- Сигнатура вызова
- Перегрузка функции
- Явный тип для this

# Дженерики

- Синтаксис

  - В функциях
  - В типах (type, interface, class)

- Явное указание закрывающего типа

- Несколько типов в дженерике

- Ограничение дженерика

- Асинхронность

  - `Promise<>`

  



# Конфиги, фичи

- Два режима
  - ScriptMode
    - Файлы без import \ export, все содержимое таких файлов доступно глобально
    - `.d.ts` файлы (d - declaration), для глобального объявления \ расширения существующих типов
  - ModuleMode
    - Файлы с import \ export, содержимое таких файлов доступно только через import
- Module Augmentation



# TODO

- declare module конструкция

### 5. **Практические паттерны**

- Branded types
- Type guards
- Assertion functions

### 2. **Модульность и пространства имен**

- `namespace`, `module`
- Declaration merging
- Ambient declarations (`.d.ts` файлы)

### 1. **Продвинутые типы**

- Условные типы (`T extends U ? X : Y`)
- Mapped Types (`{ [K in keyof T]: ... }`)
- Template Literal Types
- Recursive Types



### **Высокая важность (используются постоянно):**

- **Type guards** - ежедневно для сужения типов
- **Assertion functions** - часто для валидации
- **Mapped Types** - постоянно в utility types и библиотеках
- **Declaration merging** - регулярно в экосистеме (например, расширение Express Request)

### ⚠️ **Средняя важность (полезно знать):**

- **Условные типы** - часто в библиотеках, реже в app-коде
- **Ambient declarations (.d.ts)** - нужно для работы с JS-библиотеками
- **Template Literal Types** - мощно, но niche use cases

### 🔶 **Низкая важность (можно отложить):**

- **Branded types** - продвинутый паттерн для номинальной типизации
- **Recursive types** - редко outside JSON/деревьев
- **namespace/module** - устаревший подход, современные проекты используют ES modules