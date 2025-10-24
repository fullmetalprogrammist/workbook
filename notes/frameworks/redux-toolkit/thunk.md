---
title: "Thunk"
layout: default
parent: "Redux Toolkit"
---







# Классический redux thunk

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { thunk } from 'redux-thunk';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const initialState = {
  users: [],
  loading: false,  // <-- Статус загрузки пользователей
  error: null  // <-- Для ошибки, связанной с загрузкой пользователей
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_USERS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_USERS_SUCCESS':
      return { ...state, loading: false, users: action.payload };
    case 'FETCH_USERS_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

// action creator, но thunk'овый
const fetchUsers = (url) => {
  return async (dispatch, getState) => {
    try {
      // Диспатчим начало загрузки
      dispatch({ type: 'FETCH_USERS_START' });
      
      // Асинхронная операция
      const response = await fetch(url);
      const users = await response.json();
      
      // Если вдруг зачем-то нужно состояние
      const currentState = getState();
      
      // Диспатчим успех
      dispatch({ type: 'FETCH_USERS_SUCCESS', payload: users });
    } catch (error) {
      // Диспатчим ошибку
      dispatch({ type: 'FETCH_USERS_ERROR', payload: error.message });
    }
  };
};

// Еще один thunk - с условием
const fetchUsersIfEmpty = (url) => {
  return (dispatch, getState) => {
    const state = getState();
    
    // Проверяем условие ПЕРЕД запросом
    if (state.users.length === 0) {
      console.log('Список пустой - загружаем пользователей');
      dispatch(fetchUsers(url));
    } else {
      console.log('Пользователи уже есть, пропускаем загрузку');
    }
  };
};

// При создании хранилища надо подключить thunk-библиотеку
const store = createStore(
  userReducer,
  applyMiddleware(thunk)
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)

function App() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector(state => state);

  // <-- Диспачим танки как обычные действия, внешне ничего не изменилось
  const handleLoadUsers = () => dispatch(fetchUsersIfEmpty('https://jsonplaceholder.typicode.com/users'))
  const handleLoadUsersError = () => dispatch(fetchUsersIfEmpty('incorrect url'))

  return (<>
    <button onClick={handleLoadUsers} disabled={loading}>
      {loading ? 'Загрузка...' : 'Загрузить пользователей'}
    </button>
    <button onClick={handleLoadUsersError} disabled={loading}>
      {loading ? 'Загрузка...' : 'Загрузить пользователей (с ошибкой)'}
    </button>
    {error && <div>{error}</div>}
    <div>
      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет пользователей</p>
      )}
    </div>
  </>)
}
```

## Комментарии

- Как редакс отличает обычное действие от танка (псевдокод)

```javascript
if (typeof action === 'function') {
  action(dispatch, getState);
} else {
  next(action); 
}
```

- Реализация на пальцах
  - Для действия, которое подразумевают "грязь" (асинхронщина, условия и т.д.) пишем action creator особым образом
    - Возвращаем не просто объект "тип + нагрузка", а функцию
      - Сигнатура функции `async (dispatch, getState) => { }`
        - Редакс передает нам в нее функцию-диспетчер и состояние
        - Функция может быть синхронной, если асинхронность не нужна
      - Внутри функции делаем грязь и диспатчим обычное действие
        - Хотя можно диспачить внутри и другие грязные действия, это не важно
        - Например
          - Диспачим действие "началась загрузка", состояние меняется и приложение сразу видит этот статус
          - Делаем асинхронный запрос данных, состояние остается в статусе загрузки
          - Данные загрузились (или возникла ошибка), диспачим действие успех (или ошибку)
- Вопросы
  - Почему бы не делать асинхронщину и прочую грязь вне действия, оставляя действия простыми объектами?
    - Потому что тогда компоненты стали бы слишком "умными", а их не хочется перегружать вспомогательной логикой
    - Танк позволяет инкапсулировать душную логику, связанную с действиями, а снаружи все остается с виду простым и дружелюбным
    - Редюсеры остаются чистыми функциями