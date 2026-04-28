# Практическая работа 22. Балансировка нагрузки

В папке собрана рабочая демонстрация балансировки нагрузки для веб-приложения:

- три backend-экземпляра на Node.js, запускаемых на разных портах/в контейнерах;
- Nginx как балансировщик с `upstream`, `max_fails` и `fail_timeout`;
- HAProxy как альтернативный балансировщик;
- Docker Compose для быстрого запуска всей схемы.

## Структура

- `server.js` - общий backend-сервер с `/`, `/health` и `/api/info`;
- `nginx.conf` - конфигурация Nginx с резервным backend;
- `haproxy.cfg` - конфигурация HAProxy с `roundrobin` и `check`;
- `docker-compose.yml` - запуск двух основных backend'ов, резервного backend и двух балансировщиков;
- `Dockerfile` - образ для backend-сервера.

## Запуск

Из папки `pr22`:

```bash
docker compose up --build
```

После запуска:

- Nginx: `http://localhost:8080/`
- HAProxy: `http://localhost:8081/`

## Проверка распределения

Несколько последовательных запросов покажут, какой backend ответил:

```bash
curl http://localhost:8080/
curl http://localhost:8080/
curl http://localhost:8080/
```

В ответе меняются поля `instance` и `port`, что подтверждает балансировку.

## Локальный запуск без Docker

Можно поднять несколько экземпляров вручную:

```bash
PORT=3000 INSTANCE_NAME=backend-1 node server.js
PORT=3001 INSTANCE_NAME=backend-2 node server.js
PORT=3002 INSTANCE_NAME=backend-backup node server.js
```

Для Windows PowerShell:

```powershell
$env:PORT=3000; $env:INSTANCE_NAME='backend-1'; node server.js
$env:PORT=3001; $env:INSTANCE_NAME='backend-2'; node server.js
$env:PORT=3002; $env:INSTANCE_NAME='backend-backup'; node server.js
```