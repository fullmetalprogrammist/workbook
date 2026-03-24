# Запуск MinIO в докере

Речь о MinIO, который крутится в докере через docker-compose

```yaml
name: indamovie
services:
  # Остальные сервисы

  minio:
    image: minio/minio:latest
    #container_name: minio
    restart: unless-stopped
    ports:
      - "9000:9000"  # API порт http://localhost:9000
      - "9001:9001"  # Консоль управления http://localhost:9001
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"

  mc:
    image: minio/mc:latest
    depends_on:
      - minio
    # Запускаем интерактивную оболочку
    stdin_open: true
    tty: true
    entrypoint: /bin/sh
    # docker-compose exec -it mc sh  # выполнить эту команду в cmd, чтобы открылась консоль, и там мы сможем выполнять mc-команды

volumes:
  indamovie_db_vol:
  pgadmin_vol:
  minio_data:
```



# Приготовление: управление через консоль

- Community версия админки позволяет только создавать бакеты и загружать файлы и больше ничего
  - Поэтому все управление надо делать через консоль

- Зайти в консоль
  - Запускаем из директории, где лежит docker-compose.yaml

```
docker-compose exec -it mc sh
```

- Для управления надо сначала создать alias

```
mc alias set minio http://minio:9000
```

- После set - собственно alias, а потом протокол + имя сервиса из docker-compose конфига + порт
  - Имя сервиса именно из файла, а не фактическое имя запущенного контейнера!
- Готово, теперь можно использовать команды, ссылаясь на хранилище через алиас



# Команды

## Сделать бакет публичным для скачивания

```
mc anonymous set download minio/movies
```

- minio - алиас
- movies - имя бакета