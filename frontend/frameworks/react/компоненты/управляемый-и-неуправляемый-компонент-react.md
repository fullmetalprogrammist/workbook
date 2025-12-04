# Управляемый vs Неуправляемый компонент

## Управляемый

```jsx
function Controlled() {
  const [data, setData] = useState('hello, world!');
  console.log(data);

  return <input type='text' value={data} onChange={(e) => setData(e.target.value)} />
}
```

- реакт устанавливает значение для input через его атрибут value
  - поэтому компонент считается управляемым

## Неуправляемый

```jsx
function Uncontrolled() {
  const [data, setData] = useState('hello, world!');
  console.log(data);

  return <input type='text' onChange={(e) => setData(e.target.value)} />
}
```

- реакт не устанавливает значение для input
  - поэтому компонент считается неуправляемым
  - P.S. эта реализация не каноничная, она просто чтобы суть отличия была максимально наглядна
- каноничная реализация неуправляемых компонентов делается через useRef

```jsx
function Uncontrolled() {  // <-- Каноничная реализация неуправляемого компонента
  const [data, setData] = useState('hello, world!');
  const inputRef = useRef();

  const handleClick = () => console.log(inputRef.current.value);
  
  return (
    <div>
      <input type='text' ref={inputRef} />
      <button onClick={handleClick}>Получить значение</button>
    </div>  
  )
}
```



# Управляемый компонент

```jsx
function LoginForm() {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Данные для входа:', formData);
    // Тут оправка данных на сервер например
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Логин:
          <input
            type="text"
            name="login"
            value={formData.login}   /* Реакт устанавливает значение для компонента */ 
            onChange={handleChange}  /* При каждом изменении поля меняется состояние компонента */
          />
        </label>
      </div>
      
      <div>
        <label>
          Пароль:
          <input
            type="password"
            name="password"
            value={formData.password}  /* Реакт устанавливает значение для компонента */ 
            onChange={handleChange}    /* При каждом изменении поля меняется состояние компонента */
          />
        </label>
      </div>

      <button type="submit">Войти</button>
    </form>
  );
}
```



# Неуправляемый компонент

```jsx
import { useRef } from 'react';

function LoginForm() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      login: loginRef.current.value,  // <-- Извлекаем данные формы, когда надо
      password: passwordRef.current.value
    }
    console.log('Данные для входа:', formData);
    // Тут оправка данных на сервер например
  };

  const loginRef = useRef();
  const passwordRef = useRef();

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Логин:
          <input type="text" name="login" ref={loginRef} />  {/* Сохраняем ссылку на DOM-элемент  */}
        </label>
      </div>
      
      <div>
        <label>
          Пароль:
          <input type="password" name="password" ref={passwordRef} />
        </label>
      </div>

      <button type="submit">Войти</button>
    </form>
  );
}
```

## Явный проброс ref

- на примере, когда "input"-компонент - не базовый примитив, а самописный

```jsx
import React, { useRef } from 'react';

const MyCustomInput = React.forwardRef(({label, ...restProps}, ref) => {
  return (
    <div>
      <label>
        {label}:
        <input ref={ref} {...restProps} />
      </label>
    </div>
  )
})

function LoginForm() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      login: loginRef.current.value,
      password: passwordRef.current.value
    }
    console.log('Данные для входа:', formData);
    // Тут оправка данных на сервер например
  };

  const loginRef = useRef();
  const passwordRef = useRef();

  return (
    <form onSubmit={handleSubmit}>
      <MyCustomInput label="Логин" type="text" name="login" ref={loginRef} />
      <MyCustomInput label="Пароль" type="password" name="password" ref={passwordRef} />

      <button type="submit">Войти</button>
    </form>
  );
}
```

- комментарии
  - ref передаем как обычно, но компонент-"самописку" передаем в функцию React.forwardRef
  - `({label, ...restProps}, ref)` - почему так?
    - реакт все атрибуты компонента помещает в props и передает props первым аргументом
      - т.е. получается как бы `(props, ref)`
        - соответственно к props применяем деструктуризацию

- когда требуется проброс ref, лучше оформлять компонент через лямбду
  - можно и через FD, тогда просто синтаксис проброса будет не такой лаконичный

```jsx
// Проброс для FD
import React from 'react'

function MyCustomInput({label, ...restProps}, ref) {
  return (
    <div>
      <label>
        {label}:
        <input ref={ref} {...restProps} />
      </label>
    </div>
  )
};

export default React.forwardRef(MyCustomInput);
```