# Gestor de Solicitudes Internas

Web app para crear, gestionar y hacer seguimiento de solicitudes internas (soporte, aprobaciones, requerimientos). Aplicable a áreas de RRHH, TI, Operaciones y Finanzas.

---

## Características

| Módulo | Descripción |
|---|---|
| **Formulario de solicitud** | Crear nuevas solicitudes con tipo, urgencia, descripción, solicitante y área |
| **Bandeja de solicitudes** | Tabla con filtros por tipo, urgencia y estado; cambio de estado inline |
| **Dashboard de métricas** | Cards y gráficas con conteo de solicitudes por estado y urgencia en tiempo real |
| **Vista de detalle** | Información completa de cada solicitud con historial de cambios de estado y timestamps |

---

## Requisitos previos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 18.x o superior |
| npm | 9.x o superior |
| PostgreSQL | 14.x o superior |

---

## Estructura del proyecto

```
challenge_c_16/
├── backend/                        # API REST (Node.js + Express)
│   ├── src/
│   │   ├── app.js                  # Configuración de Express (middlewares, rutas)
│   │   ├── server.js               # Entry point – levanta el servidor HTTP
│   │   ├── application/
│   │   │   └── usecases/           # Casos de uso (lógica de aplicación)
│   │   ├── domain/
│   │   │   ├── entities/           # Modelos de dominio
│   │   │   └── repositories/       # Interfaces de repositorios
│   │   ├── infrastructure/
│   │   │   ├── database/
│   │   │   │   ├── db.js           # Pool de conexión PostgreSQL
│   │   │   │   └── seed.js         # Script de datos iniciales
│   │   │   └── repositories/       # Implementaciones concretas (PostgreSQL)
│   │   └── presentation/
│   │       ├── controllers/        # Controladores HTTP
│   │       ├── helpers/            # Helpers de respuesta API
│   │       ├── middlewares/        # Error handler global
│   │       └── routes/             # Definición de rutas
│   ├── .env.example
│   └── package.json
│
├── frontend/                       # SPA (React + Vite + TailwindCSS)
│   ├── src/
│   │   ├── App.jsx                 # Rutas de la aplicación
│   │   ├── api/
│   │   │   ├── apiClient.js        # Cliente HTTP (fetch wrapper)
│   │   │   └── services/           # Servicios por entidad
│   │   ├── components/
│   │   │   ├── dashboard/          # DashboardMetrics
│   │   │   ├── layout/             # Layout principal
│   │   │   └── ui/                 # Componentes reutilizables
│   │   ├── context/
│   │   │   └── CatalogoContext.jsx # Estado global de catálogos
│   │   └── pages/                  # Páginas de la aplicación
│   ├── .env.example
│   └── package.json
│
├── package.json                    # Scripts raíz (monorepo)
└── README.md
```

### Arquitectura limpia (Clean Architecture)

```
Presentation Layer  →  controllers / routes
Application Layer   →  use cases
Domain Layer        →  entities / repository interfaces
Infrastructure      →  PostgreSQL repositories / DB client
```

---

## Configuración de la base de datos

### 1. Crear la base de datos y el esquema

Conéctate a PostgreSQL y ejecuta:

```sql
CREATE DATABASE ai_challenge;
\c ai_challenge
CREATE SCHEMA reto_c;
```

### 2. Crear las tablas

Ejecuta el script DDL incluido en el enunciado (o el archivo `database/schema.sql` si lo agregaste al repo). El script crea las tablas:

- `reto_c.areas`
- `reto_c.tipos_solicitud`
- `reto_c.solicitudes`
- `reto_c.historial_solicitudes`

---

## Instalación y configuración local

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd challenge_c_16
```

### 2. Instalar dependencias (raíz + backend + frontend)

```bash
npm run install:all
```

> Equivale a ejecutar `npm install` en la raíz, en `backend/` y en `frontend/`.

Si prefieres instalar por separado:

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Variables de entorno – Backend

Copia el archivo de ejemplo y completa los valores:

```bash
cd backend
cp .env.example .env
```

Edita `backend/.env`:

```env
# Servidor
PORT=3001

# Base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5433
DB_NAME=ai_challenge
DB_USER=postgres
DB_PASSWORD=****

# Frontend (CORS)
FRONTEND_URL=http://localhost:5173
```

### 4. Variables de entorno – Frontend

```bash
cd frontend
cp .env.example .env
```

Edita `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

---

## Poblar la base de datos con datos iniciales

El script de seed carga áreas y tipos de solicitud predefinidos para que la app funcione de inmediato:

```bash
cd backend
node src/infrastructure/database/seed.js
```

**Datos que se insertan:**

| Áreas | Tipos de solicitud |
|---|---|
| Tecnología de la Información | Soporte Técnico (SLA 24 h) |
| Recursos Humanos | Solicitud de Personal (SLA 72 h) |
| Finanzas | Requerimiento de Compra (SLA 48 h) |
| Operaciones | Consulta Financiera (SLA 48 h) |
| Legal | Acceso a Sistemas (SLA 8 h) |
| Administración | Revisión Legal (SLA 120 h) |

> El script usa `ON CONFLICT DO NOTHING`, por lo que es seguro ejecutarlo múltiples veces.

---

## Iniciar la aplicación

### Modo desarrollo (ambos servicios en paralelo)

Desde la raíz del proyecto:

```bash
npm run dev
```

> Levanta el backend en `http://localhost:3001` y el frontend en `http://localhost:5173` de forma concurrente.

### Iniciar por separado

```bash
# Backend (con hot-reload via nodemon)
cd backend
npm run dev

# Frontend (en otra terminal)
cd frontend
npm run dev
```

### Build de producción (frontend)

```bash
cd frontend
npm run build
```

Los archivos estáticos quedan en `frontend/dist/`.

---

## Endpoints de la API

Base URL: `http://localhost:3001/api`

### Salud del servidor

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/health` | Verifica que el servidor esté activo |

### Áreas

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/areas` | Lista todas las áreas organizacionales |

### Tipos de solicitud

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/tipos-solicitud` | Lista todos los tipos de solicitud con SLA |

### Solicitudes

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/solicitudes` | Lista solicitudes con filtros opcionales (`tipo_solicitud_id`, `urgencia`, `estado`) |
| `POST` | `/solicitudes` | Crea una nueva solicitud (genera número de ticket automáticamente) |
| `GET` | `/solicitudes/:id` | Detalle de una solicitud con historial de cambios |
| `PATCH` | `/solicitudes/:id/estado` | Actualiza el estado de una solicitud |

#### Body – POST `/solicitudes`

```json
{
  "tipo_solicitud_id": 1,
  "titulo": "No puedo acceder al sistema",
  "descripcion": "Descripción detallada del problema...",
  "urgencia": "Alta",
  "solicitante": "Juan Pérez",
  "email_solicitante": "juan@empresa.com",
  "area_solicitante_id": 2
}
```

#### Body – PATCH `/solicitudes/:id/estado`

```json
{
  "estado": "En revisión",
  "usuario": "Analista TI",
  "comentario": "Se toma el caso para análisis"
}
```

**Transiciones de estado válidas:**

```
Recibida  →  En revisión | Rechazada | Cancelada
En revisión  →  Resuelta | Rechazada | Cancelada
```

### Dashboard

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/dashboard/metrics` | Métricas: total de solicitudes, conteo por estado y por urgencia |

---

## Flujo de uso rápido

1. Abrir `http://localhost:5173` en el navegador.
2. En la **Bandeja**, ver el dashboard de métricas en tiempo real.
3. Hacer clic en **"Nueva solicitud"** para crear una.
4. Completar el formulario y enviar → se genera un número de ticket (ej. `TKT-20260616-4832`).
5. En la **Bandeja**, cambiar el estado de la solicitud en el dropdown inline.
6. Hacer clic en el número de ticket para ver el **detalle** con historial completo.

---

## Tecnologías utilizadas

**Backend**
- Node.js + Express
- pg (node-postgres)
- express-validator
- dotenv
- nodemon (desarrollo)

**Frontend**
- React 18 + Vite
- TailwindCSS
- Recharts (gráficas)
- React Router DOM

**Base de datos**
- PostgreSQL 14+, esquema `reto_c`
