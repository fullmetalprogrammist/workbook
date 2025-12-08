# resolve и reject

- `Promise.resolve` возвращает успешно завершенный промис с результатом:

```javascript
Promise.resolve(5)
  .then(result => console.log(result));  //5

// То же самое
new Promise(resolve => resolve(5))
  .then(result => console.log(result));  //5
```

- `Promise.reject` возвращает отклоненный промис с ошибкой:

```javascript
Promise.reject(new Error("Ошибка!"))
.catch(err => console.log(err.message));  // Ошибка!

new Promise((resolve, reject) => reject(new Error("Ошибка!")))
  .catch(err => console.log(err.message));  // Ошибка!
```

Обычно они используются, когда какой-то метод должен вернуть промис, но при этом как таковых вычислений делать не надо, например, результат уже есть в кэше. Тогда мы просто берем этот результат и оборачиваем в завершенный промис.

# all

- Агрегирующий промис
  - Резолвится, если *все* переданные промисы резолвятся
    - Результат - массив с результатами этих промисов
      - Позиция результата в массиве соответствует позиции промиса
  - Отклоняется, если хотя бы *один* из промисов отклоняется
    - Результат - ошибка, с которой отклонился *первый* провальный промис
- Особенности
  - Нет механизма остановки - все промисы выполнятся в любом случае, даже если есть отклоненный
    - Просто их результаты \ ошибки будут проигнорированы
  - Если в all передать не-промис, то это значение попадет в результат как есть

Все успешные:

```javascript
Promise.all([
  Promise.resolve('привет'),
  Promise.resolve('мир'),
  'а я не промис'  // <-- не-промис
])
  .then(result => {
    result.forEach(x => console.log(x))
  });
/* Вывод:
привет 
мир 
а я не промис
*/
```

Есть отклоненный:

```javascript
Promise.all([
  Promise.resolve('привет'),
  Promise.reject(new Error('Первая ошибка')),
  Promise.resolve('мир'),
  Promise.reject(new Error('Вторая ошибка')),
  'а я не промис'
])
  .then(result => {  // <-- Сюда не попадем, т.к. есть отклоненный промис
    result.forEach(x => console.log(x))
  })
  .catch(error => console.log(error.message));
/* Вывод:
Первая ошибка
*/
```

Более практический пример: вывести информацию о пользователях гитхаба с указанными логинами:

```javascript
let gitUsers = ['iliakan', 'remy', 'jeresig'];
let url = 'https://api.github.com/users/';

Promise.all(
  gitUsers
    .map(gu => url + gu)
    .map(link => fetch(link))
)
  .then(responses => Promise.all(responses.map(r => r.json())))
  .then(jsoned => jsoned.forEach(ui => console.log(`id ${ui.id}, name ${ui.name}`)));
```

Комментарии:

* fetch возвращает промис. Так что мы сначала формируем ссылки, потом каждую из них запрашиваем через fetch, получая таким образом три промиса в массиве
* Полученные ответы нужно преобразовать в json
  * Метод .json тоже возвращает промис. Поэтому мы из массива ответов с помощью map снова получаем массив промисов
* Наконец, распаршенные ответы мы обходим и выводим из них информацию в консоль.



# allSettled

- Агрегирующий промис резолвится, когда все переданные промисы завершаются
  - Не важно как - резолвом или отклонением
    - Поэтому allSettled-промис никогда не отклоняется, ему все исходы подходят
- Результат - массив объектов вида
  - `{ status: 'fulfilled', value: результат }` - для успешных промисов
  - `{ status: 'rejected', reason: Error }` - для отклоненных промисов
- Особенности
  - Поддерживается не всеми платформами, нужна поддержка ES2020

```javascript
Promise.allSettled([
  Promise.resolve('привет'),
  Promise.reject(new Error('Первая ошибка')),
  Promise.resolve('мир'),
  Promise.reject(new Error('Вторая ошибка')),
  'а я не промис'
])
  .then(result => {
    result.forEach(x => {
      if (x.status === 'fulfilled') console.log('Результат: ' + x.value)
      else console.log('Ошибка: ' + x.reason.messasge)
    })
  })
/* Вывод:
"Результат: привет"
"Ошибка: undefined"
"Результат: мир"
"Ошибка: undefined"
"Результат: а я не промис"
*/
```



# race

- Агрегирующий промис резолвится, когда завершается любой из переданных промисов
  - Не важно как - резолвом или отклонением
- Результат - результат резолва или ошибка отклонения

Без ошибок:

```javascript
Promise.race([
  new Promise(resolve => setTimeout(() => resolve(1), 3000)),
  new Promise(resolve => setTimeout(() => resolve(2), 2000)),
  new Promise(resolve => setTimeout(() => resolve(3), 1000)),
])
  .then(result => console.log(result));  // 3
```

С ошибкой:

```javascript
Promise.race([
  new Promise(resolve => setTimeout(() => resolve(1), 3000)),
  new Promise(resolve => setTimeout(() => resolve(2), 2000)),
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Ошибка!")), 1000)),
])
  .then(result => console.log(result))
  .catch(err => console.log(err.message));  // Ошибка!
```

# any

- Агрегирующий промис
  - Резолвится, когда появляется первый *успешный* промис
    - Результат - результат этого резолва
  - Отклоняется, если все промисы отклонились
    - Результат - объект `AggregateError` со свойством `errors`
      - В свойстве лежит массив со всеми ошибками промисов
- Особенности
  - Поддерживается не всеми платформами, нужна поддержка ES2021

```javascript
Promise.any([
  Promise.reject(new Error('Первая ошибка')),
  Promise.reject(new Error('Вторая ошибка')),
  Promise.resolve('привет'),
  Promise.resolve('мир'),
  'а я не промис'
])
  .then(result => console.log(result))
  .catch(ae => {  // <-- Сюда не попадем, т.к. есть успешный промис
    ae.errors.forEach(error => console.log(error.message))
  });
/* Вывод:
привет
*/
```

```javascript
Promise.any([
  Promise.reject(new Error('Первая ошибка')),
  Promise.reject(new Error('Вторая ошибка')),
  Promise.reject(new Error('Третья ошибка')),
])
  .then(result => console.log(result))
  .catch(ae => {
    ae.errors.forEach(error => console.log(error.message))
  });
/* Вывод:
"Первая ошибка"
"Вторая ошибка"
"Третья ошибка"
*/
```

