# let, const, var

- Все это ключевые слова (не операторы) для объявления переменных
- `let`, `const`
  - Два современных способа объявления переменных
    - Были добавлены в ES6
  - let - для изменяемой "переменной"
  - const - для неизменяемой "константы"
    - Переменную *обязательно* нужно сразу же инициализировать при объявлении
    - Нельзя переменную перезаписать, но если в ней лежит например массив или объект - можно изменять состав \ элементы массива и поля объекта
- `var`
  - legacy-способ объявления переменной
  - еще можно встретить, но использовать уже не рекомендуется

# Отличия

- Область видимости
  - let, const
    - Блочная (блоки `{ }`, условия, циклы)
  - var
    - Область видимости - функция
    - Блоки - игнорирует

```javascript
if (true) {
  let foobar = 'hello, world!';  // <-- let | const
}
console.log(foobar);  // ❌ error, блочная область видимости
```

```javascript
if (true) {
  var foobar = 'hello, world!';  // <-- var, игнорирует блоки
}
console.log(foobar);  // ✅ 'hello, world!'
```

```javascript
function scope() {
  var foobar = 'hello, world!';  // <-- var
}
console.log(foobar);  // ❌ error, область функции - уважает, за нее не всплывает
```

- Повторное объявление
  - let, const - невозможно повторно объявить переменную с таким же именем в той же области видимости, будет ошибка
  - var - можно, новое объявление просто перезапишет предыдущее
- hoisting
  - детали можно почитать в конспекте про hoisting
  - практически
    - var-переменная - допускает обращение к себе до инициализации
    - let \ const - переменные - не допускают обращение к себе до инициализации

```javascript
console.log(foobar);  // ✅ undefined
foobar = 'goodbye';
console.log(foobar);  // goodbye
var foobar = 'hello!';  // <-- var
```

```javascript
console.log(foobar);  // ❌ Error: can't access lexical declaration 'foobar' before initialization
foobar = 'goodbye';   // ❌ тот же Error: can't access lexical declaration 'foobar' before initialization
let foobar = 'hello!';  // <-- let | const
```