# Backend REST

API REST para administrar usuarios con Express y PostgreSQL.

## Requisitos

- Node.js 20 o posterior y npm.
- PostgreSQL en ejecución y una base de datos creada.

## Instalación

1. Instala las dependencias:

   ```sh
   npm install
   ```

2. Crea un archivo `.env` en la raíz del proyecto con la configuración de tu base de datos:

   ```env
   PORT=4000
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=backend_rest
   DB_PASSWORD=tu_contraseña
   DB_PORT=5432
   ```

3. En PostgreSQL, crea la tabla que utiliza la API:

   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     username VARCHAR(100) NOT NULL UNIQUE,
     email VARCHAR(255) NOT NULL UNIQUE,
     full_name VARCHAR(255),
     age INTEGER,
     role VARCHAR(50) NOT NULL DEFAULT 'user',
     is_active BOOLEAN NOT NULL DEFAULT TRUE
   );
   ```

## Ejecución

- Desarrollo con reinicio automático: `npm run dev`
- Ejecución normal: `npm start`

El servidor escucha en el puerto indicado por `PORT` (4000 por defecto). Las rutas de usuarios están disponibles bajo `/api/users`.