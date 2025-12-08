

# call и apply

- call и apply
  - это *методы* объекта функции
  - оба они позволяют вызвать функцию, явно указав объект, который надо положить в this
  - отличия
    - отличаются тем, как принимают аргументы для вызываемой функции
      - `call` - отдельными значениями `call(context, arg1, arg2, argN);`
      - `apply` - массивом (и псевдомассивом) `apply(context, [arg1, arg2, argN]);`
        - элементы массива передаются позиционно в аргументы функции
    - как запомнить, где массив, а где отдельные значения
      - в apply первые буквы `app` похожи на `arr`, значит в apply используется массив
      - ну а в call, соответственно, отдельные значения
  - сегодня, когда есть spread оператор, метод apply можно полностью заменить на call вот так `call(context, ...params)`
    - apply остался с тех времен, когда spread-оператора не было и надо было как-то передавать массив

Синтетический пример:

```javascript
let tom = { name: "Tom" };
let huck = { name: "Huck" };

let hello = function(age, state) {
  console.log(`Hello! My name is ${this.name}. I'm ${age} years old. I live in ${state}.`);
}

hello.call(tom, 13, "Missouri");  // Каждый параметр вызываемой функции передается отдельно
hello.call(huck, 14, "Illinois");

hello.apply(tom, [13, "Missouri"]);  // Параметры вызываемой функции передаются псевдомассивом
hello.apply(huck, [14, "Illinois"]);
```

# bind

Бывают ситуации, когда нужно передать метод объекта куда-то в качестве колбэка. Но метод, выдернутый из объекта, не будет работать как надо, потому что в момент его вызова, в this будет не этот объект, а что-то другое:

```javascript
let user = {
  name: "Tom",
  intro() {
    console.log("I am " + this.name);
  }
}

user.intro();  // I am Tom

setTimeout(user.intro, 1000);  // I am ""
```

На этот случай существует метод `bind`.  Это метод объекта функции, он принимает объект, который надо использовать в качестве this, и возвращает новую функцию с "правильным" this. Подробнее о реализации механики bind - дальше в отдельном разделе. А вот просто пример использования, который чинит ошибку из предыдущего примера:

```javascript
let user = {
  name: "Tom",
  intro() {
    console.log("I am " + this.name);
  }
}

user.intro();  // I am Tom

let binded = user.intro.bind(user);  // <-- Прибиваем к методу intro объекта user правильный this
setTimeout(binded, 1000);  // I am Tom
```







# Подробнее о методе bind

## Механика метода bind

Метод bind *не изменяет исходный объект функции*, он возвращает новую функцию-обертку, которая вызывает исходную, передавая ей объект, который нужно использовать в качестве this. Для понимания как это примерно устроено, рассмотрим такой пример "самодельной" реализации bind, названной `link`:

```javascript
function link(objForThis) {
  let originFunc = this; // в this лежит объект функции, на которой вызван метод link
  
  return function(...args) {
    originFunc.call(objForThis, ...args);
  };
}

let user = {
  name: "Tom",
  intro() {
    console.log("I am " + this.name);
  }
}

user.intro.link = link;
let f = user.intro.link(user);

setTimeout(f, 1000);  // I am Tom
```

Комментарии:

* Если вызвать на функции метод, то внутри него this будет указывать на эту функцию. Все потому, что функция по своей природе является объектом, а при вызове метода на объекте, как известно, this указывает на этот объект.
* Поэтому мы сначала превращаем функцию link в метод функции intro таким образом `user.intro.link = link;`
* Следовательно, когда мы вызываем `user.intro.link(user);`, то this внутри link указывает на функцию intro.
* Т.о., выражением `origin = this;` мы сохраняем в переменную origin исходную функцию intro.
* Затем возвращаем новую функцию-обертку, которая вызывает исходную функцию с помощью call, передавая ей правильный объект под this.
  * Промежуточная переменная origin нужна, чтобы сохранить текущее значение this (замыкания нам в помощь). Нельзя было бы написать в обертке `this.call(pthis)`, потому что this - динамическое и в момент вызова обертки, this указывало бы не на intro, а на что-то другое.
* Через `...args` мы оставляем возможность передавать в функцию параметры.

Можно было бы написать link через лямбду, воспользовавшись тем, что this в лямбде вычисляется в момент ее создания и таким и остается:

```javascript
function link(zis) {
  return (...args) => this.call(zis, ...args)
}
```

this будет указывать на функцию, на которой link вызвана как метод, а zis - это объект, на котором эта функция должна быть вызвана.

## Примеры

Просто несколько примеров на закрепление.

► Прибьем контекст к обычной функции, использующей this:

```javascript
function intro() {  // <-- Обычная функция, но использует this
  console.log("I am " + this.name);
}

let user = {
  name: "Tom"
};

intro();  // I am "" // Нет контекста
let f = intro.bind(user);  // Прибили контекст
f();  // I am Tom  // Контекст появился, поэтому name теперь имеет значение
```

► Сохраним контекст для метода, выдернутого из объекта:

```javascript
let user = {
  name: "Tom",
  intro() {
    console.log("I am " + this.name);
  }
}

let f = user.intro.bind(user);
f();  // I am Tom
```

► Демонстрация того, что bind не изменяет исходную функцию:

```javascript
function intro() {
  console.log("I am " + this.name);
}

let user = {
  name: "Tom",
}

intro();  // I am ""
intro.bind(user);
intro();  // I am ""  // <-- Исходная функция intro не изменилась, поэтому и результат такой же

let introBinded = intro.bind(user);  // <-- Нужно сохранить новую функцию
// <-- и тогда при ее использовании она вызовет исходную функцию, передав ей контекст
introBinded();  // I am Tom
```

```javascript
let user = {
  name: "Tom",
  intro() {
    console.log("I am " + this.name);
  }
}

let f = user.intro;  // <-- Выдернули функцию из объекта, чтобы потерять контекст
f();  // I am ""  // <-- Конекст потерян, поэтому this.name дает пустую строку
let binded = f.bind(user);  // <-- Прибили к функции контекст
binded();  // I am Tom

let fb = user.intro.bind(user);
fb();  // I am Tom
```

► Стирание или *полная* замена исходного объекта другим объектом не повлияет на bind, потому что он запомнил ссылку на исходный объект:

```javascript
let user = {
  name: "Tom",
  intro() {
    console.log("I am " + this.name);
  }
}

let f = user.intro.bind(user);  // <-- 1. user будет запомнен в его текущей форме

// <-- 2. Делаем вызов с задержкой, чтобы успеть запороть user'а
setTimeout(f, 1000);  // <-- 4. I am Tom  // Все равно все правильно

user = "Стерли!";  // <-- 3. Уничтожаем объект контекста до момента вызова прибитой функции
```

По той же причине, если подменить объект user на другой с аналогичной структурой, на вызов это не повлияет:

```javascript
let user = {
  name: "Tom",
  intro() {
    console.log("I am " + this.name);
  }
}

let f = user.intro.bind(user);

setTimeout(f, 1000);  // I am Tom

user = {
  name: "Huck",
  intro() {
    console.log("Вообще другая функция.");
  }
}
```

Но вот если *изменить* исходный объект (а не *заменить*), то эти изменения повлияют на вызов прибитой функции:

```javascript
let user = {
  name: "Tom",
  intro() {
    console.log("I am " + this.name);
  }
}

let f = user.intro.bind(user);

setTimeout(f, 1000);  // I am Huck

user.name = "Huck";  // <-- Новое имя учтется
user.intro = function() {  // <-- А новая реализация метода - нет
  console.log("Вообще другая функция.");
}
```

Функция вызвалась исходная, потому что в момент прибития ссылка запомнилась именно на исхоную функцию. Так что замена метода в объекте на вызов прибитой функции никак не влияет.

Опять же, нюанс, вроде бы очевидый из описания bind, но все же напишу: фиксируется только реализация *прибиваемой* функции. Все остальное - будь то данные, или другие функции, могут изменяться. Пример:

```javascript
let user = {
  name: "Tom",
  intro() {  // <-- Этот метод будем прибивать
    console.log("I am " + this.name);
    this.demo();
  },
  demo() {  // <-- А этот заменим, и прибитая функция вызовет замененную версию
    console.log("foobar");
  }
}

let f = user.intro.bind(user);

setTimeout(f, 1000);  /*
  I am Huck
  HELLO, WORLD!  // а не foobar
*/

user.name = "Huck";
user.intro = function() {
  console.log("Вообще другая функция.");
}
user.demo = function() {
  console.log("HELLO, WORLD!");
}
```

## Параметры в bind

TODO: в метод bind можно передать не только объект, который надо использовать в this, но и еще аргументы. Загуглить, проверить, записать.

## bindAll

Импровизированный метод замены всех методов объекта на аналогичные, но с прибитым контекстом:

```javascript
let user = {
  name: "Tom",
  intro() {
    console.log("I am " + this.name);
  }
}

for (let key in user) {  // <-- "bindAll"
  if (typeof user[key] === 'function') {
    user[key] = user[key].bind(user);
  }
}
```

