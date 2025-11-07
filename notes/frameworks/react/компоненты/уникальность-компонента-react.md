---
title: "Уникальность компонента React"
layout: default
parent: "React"
---



<h1>Оглавление</h1>
- TOC
{:toc}



# Списки элементов

```jsx
const App = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Купить молоко' },
    { id: 2, text: 'Сходить на почту' },
    { id: 3, text: 'Подписать петицию' },
    { id: 4, text: 'Покормить Чампа' }
  ]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    setTodos([
      { id: Date.now(), text: newTodo },  // <-- Date.now() выдает число, например 1717591234567
      ...todos
    ]);
  };

  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div>
      <input type="text" onChange={(e) => setNewTodo(e.target.value)} />
      <button onClick={addTodo}>Добавить</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>  {/* с key каждый элемент однозначно идентифицирован  */}
            <input type="checkbox" />
            <span>{todo.text}</span>
            <button onClick={() => removeTodo(todo.id)}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

