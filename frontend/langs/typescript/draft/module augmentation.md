```typescript
import { SomeLib } from "some-lib";

// Говорим TypeScript: "Расширь типы модуля some-lib"
declare module "some-lib" {
  interface SomeLib {          // 🎯 Merge с оригинальным SomeLib!
    newMethod(): void;         // Добавляем новый метод
    customProperty: string;    // Добавляем новое свойство
  }
}
```

Пример расширения интерфейса с помощью declaration merging