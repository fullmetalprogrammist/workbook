- Структура
  - Несколько модулей "обычных" (будущие микросервисы)
  - Один модуль app под spring-web для приема http-запросов







# Мануал

- Создать родительский проект
- Подключить к нему дочерние
- Правильно связать их

## Родительский проект

- Обычный пустой Java-Maven проект
  - Можно создать через  IDE
- Удалить src папку - кода никакого не будет
- pom примерно такой

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.ths</groupId>
    <artifactId>ths</artifactId>
    <version>1.0.0</version>
    <packaging>pom</packaging>

    <modules>
        <module>user</module>
        <module>app</module>
    </modules>

    <properties>
        <maven.compiler.source>25</maven.compiler.source>
        <maven.compiler.target>25</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

</project>
```

- Что важно
  - в `modules` секцию будем добавлять дочерние проекты
  - `packaging` настройке ставим значение pom
  - `version` ставим что-то вменяемое



## Дочерний проект - точка входа

- Это проект, который запускается из IDE, у меня spring boot web
  - Из него не надо ссылаться на родительский, его родитель - спринг
  - Как я создал
    - На сайте генератора спринг проектов создал как обычно, положил в корень родительского, удалил гит-файлы
- pom (фрагмент):

```xml
<parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>4.0.5</version>
  <relativePath/>
</parent>

<artifactId>app</artifactId>
```

- Тут понадобилось добавить `artifactId`
- В этот проект в зависимости надо будет добавлять "обычные" дочерние проекты

```xml
<dependencies>
		<!-- остальные спринговые зависимости -->
  <dependency>
    <groupId>com.ths</groupId>
    <artifactId>user</artifactId>
    <version>1.0.0</version>
  </dependency>
  <dependency>
    <groupId>com.ths</groupId>
    <artifactId>order</artifactId>
    <version>1.0.0</version>
  </dependency>
</dependencies>
```

P.S. Возможно придется после добавления других проектов тут что-то менять, чтобы он был точкой входа и запускался из ide?





## Дочерний проект - "обычный"

- "Обычный" - значит не точка входа, по сути как библиотека с функциональностью
- Добавлял через IDE через ПКМ по родителю > New > Module

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.ths</groupId>
        <artifactId>ths</artifactId>
        <version>1.0.0</version>
    </parent>

    <artifactId>user</artifactId>

    <properties>
        <maven.compiler.source>25</maven.compiler.source>
        <maven.compiler.target>25</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

</project>
```

- тут важно сослаться на родительский проект через `parent`, надо указать группу, артефакт и версию
- Пакет добавляем в исходных код как имя модуля, например user, чтобы получилось com.ths.user



## Согласованность версий зависимостей

- в родительский pom надо вставить раздел dependencyManagement

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-dependencies</artifactId>
      <version>4.0.5</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

- groupId, version берем из pom спрингового проекта, а артефакт ставим `spring-boot-dependencies`
- теперь в бизнесовых модулей можно подключать зависимости без указания версий. Для тех зависимостей, которые есть в спринге (lombok например) версия возьмется автоматически:

```xml
<!-- pom бизнес-модуля user -->
<dependencies>
  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
  </dependency>
</dependencies>
```

