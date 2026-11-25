# FILM!

## Бэкенд

Бэкенд использует PostgreSQL. Установите зависимости:

```bash
cd backend
npm ci
```

Создайте в папке `backend` файл `.env` на основе `.env.example` и укажите
параметры подключения к PostgreSQL:

- `DATABASE_HOST`
- `DATABASE_PORT`
- `DATABASE_NAME`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`

Значение`DATABASE_DRIVER` должно быть `postgres`.

SQL-файлы в `backend/test` содержат схему базы данных и тестовые данные фильмов
и сеансов.

Запустите бэкенд в режиме разработки:

```bash
npm run start:dev
```

Проверки линтера и сборки:

```bash
npm run lint
npm run build
```
