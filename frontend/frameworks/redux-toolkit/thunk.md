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
      dispatch({ type: 'FETCH_USERS_START' });  // <-- Диспатчим начало загрузки
      
      // Асинхронная загрузка
      const response = await fetch(url);
      const users = await response.json();
      
      // Если вдруг зачем-то нужно состояние
      const currentState = getState();
      
      dispatch({ type: 'FETCH_USERS_SUCCESS', payload: users });  // <-- Диспатчим успех
    } catch (error) {
      dispatch({ type: 'FETCH_USERS_ERROR', payload: error.message });  // <-- // Диспатчим ошибку
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

// <-- При создании хранилища надо подключить thunk-библиотеку самостоятельно
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



# RTK Thunk

## Почти как классика

- Не канонично для RTK
- Технически все то же самое, что при классическом подходе
  - Ручное управление ходом загрузки
    - Руками ставим loading, руками его снимаем
    - Руками устанавливаем результат или ошибку

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { Provider, useSelector, useDispatch } from 'react-redux'

// Создаем slice с помощью RTK
const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null
  },
  reducers: {
    fetchUsersStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchUsersSuccess: (state, action) => {
      state.loading = false
      state.users = action.payload
    },
    fetchUsersError: (state, action) => {
      state.loading = false
      state.error = action.payload
    }
  }
})

// Экспортируем actions
export const { 
  fetchUsersStart, 
  fetchUsersSuccess, 
  fetchUsersError 
} = usersSlice.actions

// Thunk для загрузки пользователей
export const fetchUsers = (url) => async (dispatch) => {
  try {
    dispatch(fetchUsersStart())  // <-- Все руками
    
    const response = await fetch(url)
    const users = await response.json()
    
    dispatch(fetchUsersSuccess(users))
  } catch (error) {
    dispatch(fetchUsersError(error.message))
  }
}

// Условный thunk
export const fetchUsersIfEmpty = (url) => (dispatch, getState) => {
  const state = getState()
  
  if (state.users.users.length === 0) {
    console.log('Список пустой - загружаем пользователей')
    dispatch(fetchUsers(url))
  } else {
    console.log('Пользователи уже есть, пропускаем загрузку')
  }
}

// Настраиваем store с помощью RTK
const store = configureStore({
  reducer: {
    users: usersSlice.reducer
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)

function App() {
  const dispatch = useDispatch()
  const { users, loading, error } = useSelector(state => state.users)

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



## Через createAsyncThunk

- Канонично для RTK
  - Описывать танк через функцию `createAsyncThunk`
    - Плюсы
      - Помогает управлять статусами, предоставляет нам `pending`, `fullfilled`, `rejected`
        - `fetchUsers.pending` - это action creator, возвращает действие с типом `users/fetchUsers/pending`
        - Это называется `авто-действия`
          - Потому что когда мы диспачим "rtk"-танк, то это приводит к созданию промиса и **автоматическому** диспачу pending-действия. Когда промис резолвится, то автоматически диспачится fulfilled-действие. А если промис отклоняется, тогда автоматически диспачится rejected-действие
        - Для "успеха" надо просто вернуть из функции значение
        - Для "провала" - вызвать функцию `rejectWithValue(причина)`
          - rejectWithValue мы получаем от редакса

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { createAsyncThunk } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk(  // <-- Канонично для большинства случаев
  'users/fetchUsers',
  async (url: string, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await fetch(url);
      const users = await response.json();
      return users;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {  // <-- Для авто-действий пишем обработчики вот так
    builder
      .addCase(fetchUsers.pending, (state) => {  // <-- 'users/fetchUsers/pending'
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

// Условный thunk - оставляем как в классическом подходе
function fetchUsersIfEmpty (url) {
  return (dispatch, getState) => {
    const state = getState()
    
    if (state.users.users.length === 0) {
      console.log('Список пустой - загружаем пользователей')
      dispatch(fetchUsers(url))
    } else {
      console.log('Пользователи уже есть, пропускаем загрузку')
    }
  }
} 

// Настраиваем store с помощью RTK - отдельно подключать thunk-миддлвар не надо, он уже есть по дефолту
const store = configureStore({
  reducer: {
    users: usersSlice.reducer
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)

function App() {
  const dispatch = useDispatch()
  const { users, loading, error } = useSelector(state => state.users)

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

