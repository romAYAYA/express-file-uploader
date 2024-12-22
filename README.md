commands: 
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build              | runs prod mode
docker-compose up                                                                       | runs dev mode

.env vars:
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
