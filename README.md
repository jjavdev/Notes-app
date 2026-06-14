# Notes App

Full-stack note-taking SPA with categories, filtering, and authentication.

Built for the Ensolvers Full Stack implementation exercise.

## Requirements

| Runtime/Tool | Version |
|-------------|---------|
| **Node.js** | ^22.16.0 |
| **npm** | ^10.0.0 |
| **Docker** (optional) | 24.x+ |
| **bash** | 5.x |
| **OS** | Linux / macOS / WSL2 |

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + Vite + React Router | React 19.0.0, Vite 6.0.0 |
| Backend | NestJS | 11.0.0 |
| ORM | TypeORM | 0.3.21 |
| Database | PostgreSQL | 16 |
| Auth | JWT (@nestjs/jwt) | 11.0.0 |
| Runtime | Node.js | ^22.16.0 |

## Architecture

```
notes-app/
├── backend/          → NestJS REST API (Controller → Service → Repository)
├── frontend/         → React SPA (Vite)
├── docker-compose.yml → PostgreSQL service
└── start.sh          → One-command launcher
```

Backend layers:
- **Controllers** — HTTP route handlers, request validation
- **Services** — Business logic
- **Repositories** — Data access via TypeORM

Frontend:
- **Pages** — LoginPage, HomePage, ArchivedPage, NoteFormPage
- **Components** — Layout (sidebar), NoteCard
- **Services** — `api.ts` (fetch wrapper with JWT)
- **Contexts** — AuthContext (token management)

## Quick Start

```bash
chmod +x start.sh
./start.sh
```

This single command will:
1. Start PostgreSQL (via Docker Compose, or use an existing instance)
2. Install npm dependencies for backend and frontend
3. Build the backend
4. Start both servers

### Without Docker

If you don't have Docker, start PostgreSQL manually and run:

```bash
export DB_HOST=localhost DB_PORT=5432 DB_USERNAME=postgres DB_PASSWORD=postgres DB_NAME=notes_app
cd backend && npm install && npm run build && node dist/main.js &
cd ../frontend && npm install && npx vite
```

## Access

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3001 |

### Default Credentials

| Username | Password |
|----------|----------|
| `admin` | `admin` |

## Features

### Fase 1 (Obligatoria)
- [x] Create, edit, and delete notes
- [x] Archive / unarchive notes
- [x] List active notes
- [x] List archived notes

### Fase 2 (Puntos extra)
- [x] Add / remove categories to/from notes
- [x] Filter notes by category

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login (returns JWT token) |

### Notes (require `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notes` | List notes (`?archived=true/false`, `?categoryId=1`) |
| GET | `/notes/:id` | Get note by ID |
| POST | `/notes` | Create note |
| PUT | `/notes/:id` | Update note |
| PATCH | `/notes/:id/archive` | Toggle archive |
| DELETE | `/notes/:id` | Delete note |
| POST | `/notes/:id/categories` | Add category to note |
| DELETE | `/notes/:id/categories/:catId` | Remove category |

### Categories (require `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | List all categories |
| POST | `/categories` | Create category |
| DELETE | `/categories/:id` | Delete category |

## Live Demo

Not deployed yet.
