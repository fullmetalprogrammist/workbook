# Карта

- `keyof ТИП С ПОЛЯМИ -> union полей`
  - Технически, keyof можно применять ко всем типам, даже к примитивам, но на практике в 99% случаев его применяют только к типам, у которых есть поля (type, interface, class)
- [keyof для type, class, interface](#keyof-для-type-class-interface)
  - В type, class, interface имена полей - это не строки, а литеральные типы
    - keyof берет эти литеральные типы, применяет к ним `|` union и возвращает полученный тип-объединение как результат
- Конструкции с keyof
  - [extends + keyof](#extends-keyof)
  - TODO больше примеров
- Сценарии использования keyof
  - [Безопасный доступ к свойствам](#безопасный-доступ-к-свойствам)
  - TODO больше примеров



# keyof для type, class, interface

```typescript
type User = {  // <-- User это структурный тип (т.е. тип с полями)
  firstname: string;
  lastname: string;
  email: string;
}
```

```typescript
type foobar = keyof User;  // union-тип из литералов: 'firstname' | 'lastname' | 'email'
```





# Конструкции с keyof

## extends keyof

Часто можно видеть в дженериках:

```typescript
function getProperty<T, K extends keyof T>
```





# Сценарии использования keyof

## Безопасный доступ к свойствам

### Пример 1

Написать функцию, которая принимает объект, имя поля и возвращает значение этого поля. Она не должна позволять передавать себе поле, которого нет в объекте:

```typescript
type Person = {
  name: string;
  age: number;
}

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: Person = { name: "John", age: 30 };
getProperty(user, "name");  // ✅
getProperty(user, "age");   // ✅
getProperty(user, "email"); // ❌ Нет поля email
```

### Пример 2

Допустим, есть массив объектов. Нужно написать функцию, которая принимает массив этих объектов, имя поля, и возвращает массив из значений этого поля:

```javascript
// Без TS
const users = [
  { id: 1, name: "John", role: "admin" },
  { id: 2, name: "Alice", role: "user" }
];

function foobar(objs, field) {
  return objs.map(obj => obj[field])
}

console.log(foobar(users, "name"));     // ["John", "Alice"] 
console.log(foobar(users, "address"));  // [undefined, undefined]
```

Надо типизировать функцию, чтобы нельзя было передать поле, которого нет в объекте. Функция должна быть универсальной для всех объектов:

```typescript
type User = {
  id: number;
  name: string;
  role: string;
}

const users: User[] = [
  { id: 1, name: "John", role: "admin" },
  { id: 2, name: "Alice", role: "user" }
];

function foobar<T, K extends keyof T>(objs: T[], field: K): T[K][] {
  return objs.map(obj => obj[field])
}

console.log(foobar(users, "name"));     // ✅ ["John", "Alice"] 
console.log(foobar(users, "role"));     // ✅ ["admin", "user"]
console.log(foobar(users, "address"));  // ❌ ошибка компиляции
```



