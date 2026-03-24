

# Конспект

## Установка и подключение (Vite + ванильный React)

P.S. Вероятно это не для ванильного реакта и vite, не сработало в новом проекте.

Некст раз попробовать сразу делать по мануалу с их сайта https://tailwindcss.com/docs/installation/using-vite вот по нему для ванилы вроде работает

### Пакеты

```
npm install -D tailwindcss postcss autoprefixer @tailwindcss/postcss
```

### Конфиги

- tailwind.config.js - в корне проекта

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

- postcss.config.js - в корне проекта

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

- index.css - в папке src

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Теперь в main.tsx подключить css (это единственное место, где надо подключать, дальше оно все само):

```tsx
import './index.css'
```

- Перезапустить dev сервер