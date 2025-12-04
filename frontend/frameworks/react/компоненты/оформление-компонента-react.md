# Стиль описания компонента

## Function Declaration

```jsx
function Welcome() {  // <-- Объявляем через слово function
  return (
    <div>
      <h1>Привет, React!</h1>
      <p>Этот компонент описан в FD-стиле</p>
    </div>
  );
}
```



## Лямбда

```jsx
const Welcome = () => {  // <-- Кладем лямбду в переменную
  return (
    <div>
      <h1>Привет, React!</h1>
      <p>Этот компонент описан через лямбду</p>
    </div>
  );
};
```





# Варианты экспорта

## Дефолтный экспорт

- Вариант 1 - экспорт сразу при объявлении

```jsx
export default function Welcome() {  // <-- Описание + экспорт
  return (
    <div>Привет, React</div>
  )
}
```

- Вариант 2 - экспорт отдельной командой

```jsx
function Welcome() {  // <-- Описание
  return (
    <div>Привет, React</div>
  )
}

export default Welcome;  // <-- Экспорт
```

- Как импортировать "дефолты"
  - можно использовать изначальное имя компонента или произвольное

```jsx
import Welcome from "./components/Welcome";  // <-- Исходное имя
import Willkommen from "./components/Welcome";  // <-- или произвольное
```



## Обычный экспорт

- Он же "именованный" экспорт
  - тоже возможен как сразу при описании, так и отдельными командами

```jsx
export function Welcome() {  // Описание + экспорт
  return (
    <div>Привет, React</div>
  )
}
```

```jsx
function Welcome() {  // <-- Описали
  return (
    <div>Привет, React</div>
  )
}

export Welcome;  // <-- Экспортировали
```

- Импорт
  - Возможен только под исходным именем
    - но можно сразу же переименовать с помощью `as`
  - Нужны `{ }` при именованном импорте

```jsx
import {Welcome} from "./components/Welcome";  // <-- Под исходным
import {Welcome as Willkommen} from "./components/Welcome";  // <-- Можно переименовать
```

