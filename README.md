# Как запустить

- Backend:
  docker-compose up -d --build
  docker exec -it teammanager bash

//Внутри контейнера
composer require laravel/reverb
composer install
php artisan reverb:install
php artisan migrate
//Ливаем с контейнера включаем вебсокет
docker start teammanager_reverb

- Frontend:
 

