# Карта

- union - оператор для объединения типов
  - Два вида
    - `|` - объединение типов
      - Актуально для примитивов и не примитивов
    - `&` - пересечение типов
      - Актуально только для структурных типов
        - Потому что для примитивов даст тип never (тип не может одновременно быть и строкой, и числом)
- Паттерн discriminated unions
  - Когда у типов есть одно общее поле, а остальные разные, по значению этого поля ts может понять наличие остальных полей



# Объединение - |

## Примитивов

Примитивы трансформируются в литералы и потом объединяются в общий тип:

```typescript
type direction = 'up' | 'down' | 'left' | 'right';
// up, down, left, right - не string'и, а литералы.
```

## Структурных типов

Для структурных типов: `A | B` - обязательно *все* поля одного из типов, а поля из другого - опционально (могут присутствовать полностью, частично или вообще отсутствовать):

```typescript
type A = { x: number; a: string };
type B = { y: string; b: boolean };

// Можно:
const v1: A | B = { x: 1, a: 'hi' };        // full A
const v2: A | B = { y: 'hey', b: true };    // full B  
const v3: A | B = { x: 1, a: 'hi', y: 'hey' }; // full A + part B

// Нельзя:
const inv: A | B = { x: 1 }; // part A + ничего из B ❌
```



# Пересечение - &

* `&` пересечение типов => тип.
  * Типичное применение - для объектных типов: A & B - обязательно все поля из обоих типов.



# Паттерн discriminated unions

Когда у типов есть одно совпадающее поле-литерал ("поле-дискриминатор", от лат. discriminare - "различать"), а остальные поля разные, по значению этого поля ts может понять наличие остальных полей:

```typescript
type ApiResponse = 
  | { status: 'success'; data: string }
  | { status: 'error'; code: number }
  | { status: 'loading'; progress: number };

function handleResponse(response: ApiResponse) {
  // TypeScript автоматически сужает тип на основе status!
  switch (response.status) {
    case 'success':
      console.log(response.data);    // ✅ TS знает про data
      break;
    case 'error':
      console.log(response.code);    // ✅ TS знает про code
      console.log(response.data);    // ❌ не даст обратиться
      break;
    case 'loading':
      console.log(response.progress); // ✅ TS знает про progress
      break;
  }
}
```

