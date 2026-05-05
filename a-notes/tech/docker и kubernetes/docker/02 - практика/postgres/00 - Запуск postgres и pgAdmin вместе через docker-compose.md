# Конфиг запуска

- Логичнее запускать через docker-compose разом и СУБД, и pgAdmin
  - Так они будут в одной сети и будут видеть друг друга
  - Не придется ставить десктоп-версию pgAdmin
- docker-compose.yaml:

```yaml
name: indamovie
services:
  pgs:
    image: postgres
    environment:
      POSTGRES_PASSWORD: j123
    volumes:
      - indamovie_db_vol:/var/lib/postgresql
    ports:
      - "5432:5432"

  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "8080:80"
volumes:
  indamovie_db_vol:
```

Более новая версия:

```yaml
name: postgres_train

services:
  pgs:
    image: postgres
    container_name: postgres_db
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin123
      POSTGRES_DB: training_db
    volumes:
      - postgres_data:/var/lib/postgresql
    ports:
      - "5432:5432"
    command: >
      postgres -c shared_preload_libraries='pg_stat_statements'
              -c pg_stat_statements.track=all
              -c pg_stat_statements.max=10000

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    volumes:
      - pgadmin_data:/var/lib/pgadmin
volumes:
  postgres_data:
  pgadmin_data:
```

- Сразу добавил и том, чтобы данные, сохраненные в БД, не терялись при удалении контейнера
- Порт 5432 прокинул на такой же порт компа, чтобы приложения, запущенные на компе, могли обращаться к БД

# Важное по настройке параметров БД

- При старте контейнера с СУБД есть возможность задать и имя пользователя, и имя БД, но на деле лучше этого не делать
  - По умолчанию в контейнере создаются:
    - БД с названием `postgres`
    - Пользователь с именем `postgres`
  - Если через переменные окружения задать другое имя для БД и пользователя, то они создадутся вместо дефолтных
    - Т.е. БД postgres и юзера postgres не будет, а будут те, которые мы указали
  - Но какие-то системы могут полагаться именно на наличие дефолтных БД и пользователя
  - Поэтому лучше оставить дефолтных, а если очень хочется, то потом после запуска контейнера уже дополнительно создать кастомных
- Изменения БД и пользователя при старте контейнера - на свой страх и риск



# Подключение из pgAdmin

- после того как контейнеры запустятся, pgAdmin доступен в браузере по адресу http://localhost:8080
  - порт такой же, как в yaml задали
  - стандартный логин пароль для входа в GUI будет `admin@admin.com` + `admin`, как в конфиге
- логинимся по кредам, которые указали в docker-compose
- подключаемся к серверу, настройки такие:
  - Вкладка `General`
    - `Name` - любое, просто косметическое имя, которое будет в интерфейсе
  - Вкладка `Connection`
    - PPS. Вероятно, дефолтных пользователя и БД все же менять можно, так что все настройки для соединения надо брать как в yaml задавали
    - `Host name / address` - имя сервиса из docker-compose (в данном случае **pgs**, см. конфиг выше)
      - поскольку и СУБД, и pgAdmin находятся внутри сети докера, нам не нужны IP-адреса сервисов, ими управляет докер, а мы можем для ссылки на сервис использовать просто его имя
    - `Port` - **5432**, т.к. это дефолт настроек официального образа и менять его а) сложно б) не нужно и не рекомендуется
    - `Maintenance database` - **postgres**, дефолтная БД, мы ее не переопределяли в конфиге
      - СУБД должна иметь возможность подключиться хотя бы к одной БД, чтобы запросить список БД
      - так что дефолтную postgres базу мы не обязаны использовать, чтобы хранить данные, но желательно иметь ее, просто чтобы создать соединение с серверов в pgAdmin
    - `Username` - **postgres**, опять же дефолтный юзер, мы его не меняли в целях избежания скрытых проблем
    - `Password` - **j123**, а вот пароль ставим тот, который в docker-compose указывали