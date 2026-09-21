# TeamRoster - Panel de Administración RRHH

Aplicación full-stack para la gestión de empleados internos (CRUD) con React, Node.js, Express, Sequelize y SQLite.

## Estructura del proyecto

```
TeamRoster/
├── backend/           # API REST con Node.js + Express + Sequelize
│   ├── src/
│   │   ├── config/    # Configuración de base de datos
│   │   ├── controllers/ # Controladores de usuarios
│   │   ├── models/    # Modelos de Sequelize
│   │   ├── routes/    # Rutas de la API
│   │   └── server.js  # Punto de entrada
│   └── package.json
├── frontend/          # SPA con React + Vite + React Router
│   ├── src/
│   │   ├── components/ # Componentes reutilizables
│   │   ├── hooks/     # Custom hooks
│   │   ├── pages/     # Páginas de la aplicación
│   │   ├── services/  # Servicios de API
│   │   ├── styles/    # Estilos CSS
│   │   ├── App.jsx    # Componente principal con routing
│   │   └── main.jsx   # Punto de entrada
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Requisitos previos

- Node.js >= 18.x
- npm >= 9.x

## Instalación

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Ejecución

### Modo desarrollo (requiere 2 terminales)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
El servidor se iniciará en `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
La aplicación se abrirá en `http://localhost:5173`

### Modo producción

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/users` | Listar todos los usuarios |
| GET | `/api/users/:id` | Obtener un usuario por ID |
| POST | `/api/users` | Crear un nuevo usuario |
| PUT | `/api/users/:id` | Actualizar email y/o domicilio |
| DELETE | `/api/users/:id` | Eliminar un usuario |
| GET | `/api/health` | Health check |

### Ejemplo de payload para POST/PUT

```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "documento": "12345678",
  "legajo": "EMP-001",
  "email": "juan.perez@marketplace.com",
  "domicilio": "Av. Corrientes 1234, CABA"
}
```

## Modelo de datos (User)

| Campo | Tipo | Requerido | Único | Descripción |
|-------|------|-----------|-------|-------------|
| id | INTEGER | Auto | PK | Identificador autoincremental |
| nombre | STRING(100) | Sí | No | Nombre del empleado |
| apellido | STRING(100) | Sí | No | Apellido del empleado |
| documento | STRING(20) | Sí | Sí | DNI o Pasaporte |
| legajo | STRING(20) | Sí | Sí | Identificador único de empleado |
| email | STRING(150) | Sí | Sí | Correo electrónico |
| domicilio | STRING(255) | Sí | No | Dirección completa |
| createdAt | DATE | Auto | No | Fecha de creación |
| updatedAt | DATE | Auto | No | Fecha de actualización |

## Validaciones

- **Frontend**: Validación en tiempo real en el formulario
- **Backend**: Validaciones con Sequelize (notEmpty, len, isEmail, unique)

## Funcionalidades

- ✅ Listado de usuarios con tabla responsive
- ✅ Crear nuevo empleado con validaciones
- ✅ Editar email y domicilio de empleados existentes
- ✅ Eliminar empleados con confirmación
- ✅ Persistencia en SQLite (archivo `database.sqlite`)
- ✅ SPA sin recarga de página (React Router)
- ✅ Interfaz responsive y moderna
- ✅ Manejo de errores y estados de carga

## Base de datos

La base de datos SQLite se crea automáticamente en `backend/database.sqlite` al iniciar el servidor por primera vez. Sequelize sincroniza el esquema automáticamente (`alter: true`).

## Variables de entorno (opcional)

Crear archivo `.env` en `backend/`:

```env
PORT=3001
```

## Licencia

MIT