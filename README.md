# Docker Compose Commands

## Run in Production Mode

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

## Run in Development Mode
```bash
docker-compose up
```

# Environment Variables
```env
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
REDIS_HOST=
REDIS_PORT=

MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=
JWT_SECRET=

APP_PORT=
APP_HOST=
```
