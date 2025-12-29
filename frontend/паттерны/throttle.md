# throttle

- `throttle` - это паттерн "Вызвать функцию один раз за указанный интервал. Остальные попытки вызова - игнорировать, пока не наступит новый интервал"
  - Например, надо обрабатывать скроллинг
    - Событие скролла за секунду может сработать целую кучу раз, если мощно крутить колесо
    - Если обработчик тяжелый, это крепко загрузит браузер
    - Поэтому мы хотим, чтобы обработчик скролла вызывался, например, только один раз в секунду, а остальные вызовы скипались
- Троттл реализуется через таймер
- Существует три вариации
  - leading
  - trailing
  - leading + trailing

Заготовка для страницы:

```javascript
// const throttledPressHandler = throttleLeading(showPressed, 2000);
// const throttledPressHandler = throttleTrainling(showPressed, 2000);
const throttledPressHandler = throttleLeadingTrailing(showPressed, 2000);
document.addEventListener('keydown', throttledPressHandler);

function showPressed(event) {
  console.log(event.key);
}
```



## leading реализация

```javascript
function throttleLeading(fn, delay) {
  let timer;

  return (...args) => {
    if (timer) return;
    fn(...args);
    timer = setTimeout(() => timer = null, delay);
  }
}
```

- Особенности
  - самый первый вызов функции происходит мгновенно, без задержки
  - если до "разрешающего" щелчка таймера происходят еще вызовы, мы их теряем
  - схема работы: начинается поток событий, мы обрабатываем первое, дальше игнор до щелчка таймера
  - используется, когда важна немедленная реакция на событие

## trailing реализация

```javascript
function throttleTrainling(fn, delay) {
  let timer;
  let lastArgs;

  return (...args) => {
    lastArgs = args;
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      fn(...lastArgs);
      lastArgs = null;
    }, delay)
  }
}
```

- Особенности
  - "первые" вызовы функции игнорируются
  - фактически первым выполнится последний вызов, который успел поступить до щелчка таймера

## leading + trailing

```javascript
function throttleLeadingTrailing(fn, delay) {
  let timer;
  let lastArgs;
  
  return (...args) => {
    lastArgs = args;
    if (timer) return;
    fn(...lastArgs);
    timer = setTimeout(() => {
      timer = null;
      fn(...lastArgs);
      lastArgs = null;
    }, delay);
  }
}
```

- Особенности
  - и первый, и последний вызов обрабатываются, ничего не теряем, но из-за этого на границе щелчка таймера могут возникнуть два вызова подряд, без задержки