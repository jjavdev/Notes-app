# Notes App

Full-stack note-taking SPA with categories, filtering, and authentication.

Built for the Ensolvers Full Stack implementation exercise.

## Live Demo

[Deploy pending — see instructions below]

## Exercise Description

### Phase 1 (Required) — Note Management
- Create, edit, and delete notes
- Archive / unarchive notes
- List active notes
- List archived notes

### Phase 2 (Bonus) — Categories & Filtering
- Add / remove categories to/from notes
- Filter notes by category

## Deliverables

- **Source code** uploaded to a private GitHub repository with proper git usage.
- **Frontend** and **Backend** in separate folders (`backend/`, `frontend/`), each with its own `package.json` and dependencies.
- **Bash startup script** (`start.sh`) that configures the database, installs dependencies, and launches both servers with a single command.
- **README.md** documenting all runtimes, engines, and tools with exact versions (see below).

## Technologies

### Architecture

The application follows a **Single Page Application (SPA)** architecture:

- **Frontend** — React SPA built with Vite, isolated in its own folder with its own `package.json` and dependencies.
- **Backend** — REST API built with NestJS, organized in three layers:
  - **Controllers** — HTTP route handlers and request validation
  - **Services** — Business logic
  - **Repositories** — Data access via TypeORM (data persistence)
- **Database** — Relational database (PostgreSQL) accessed through an ORM (TypeORM). No in-memory storage or mocks.

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + Vite + React Router | React 19.0.0, Vite 6.0.0 |
| Backend | NestJS | 11.0.0 |
| ORM | TypeORM | 0.3.21 |
| Database | PostgreSQL | 16 |
| Authentication | JWT (@nestjs/jwt) | 11.0.0 |
| Runtime | Node.js | ^22.16.0 |
| Package Manager | npm | ^10.0.0 |
| Docker (optional) | Docker Compose | 24.x+ |
| Shell | bash | 5.x |
| OS | Linux / macOS / WSL2 / Windows (with local PostgreSQL) |

## Architecture

```
notes-app/
├── backend/              → NestJS REST API (Controller → Service → Repository)
│   ├── src/
│   │   ├── auth/         → Authentication (JWT)
│   │   ├── notes/        → Notes CRUD — Controller, Service, Repository
│   │   ├── categories/   → Categories CRUD — Controller, Service, Repository
│   │   ├── entities/     → TypeORM entities (Note, Category)
│   │   └── dto/          → Data Transfer Objects (validation)
│   └── package.json
├── frontend/             → React SPA (Vite)
│   ├── src/
│   │   ├── pages/        → LoginPage, HomePage, ArchivedPage, NoteFormPage
│   │   ├── components/   → Layout (sidebar), NoteCard
│   │   ├── services/     → api.ts (fetch wrapper with JWT)
│   │   ├── contexts/     → AuthContext (token management)
│   │   └── types/        → TypeScript interfaces
│   └── package.json
├── docker-compose.yml    → PostgreSQL service (for Linux/macOS)
├── start.sh              → One-command launcher
├── render.yaml           → Deployment config for Render
└── README.md
```

## Quick Start

### Prerequisites

Install the following on your system:

- **Node.js** ^22.16.0
- **npm** ^10.0.0
- **PostgreSQL** 16 (locally or via Docker)
- **Docker** 24.x+ (optional — for the Docker Compose PostgreSQL service)
- **bash** 5.x

### One-command startup (recommended for Linux/macOS)

```bash
chmod +x start.sh
./start.sh
```

This script will:
1. Start PostgreSQL via Docker Compose (or use an existing local instance)
2. Install npm dependencies for both backend and frontend
3. Build the backend
4. Start backend on port 3001 and frontend on port 5173

### Manual startup (all platforms)

#### 1. Database

**Option A — Docker (Linux/macOS):**
```bash
docker compose up -d
```

**Option B — Local PostgreSQL:**
Make sure PostgreSQL is running on port 5432 with:
- Database: `notes_app`
- User: `postgres`
- Password: `postgres`

#### 2. Backend

```bash
cd backend
cp ../.env.example .env   # or configure environment variables
npm install
npm run build
node dist/main.js
```

The API will be available at http://localhost:3001

#### 3. Frontend

In a separate terminal:

```bash
cd frontend
npm install
npx vite
```

The app will be available at http://localhost:5173

## Access

### Frontend

Open http://localhost:5173 in your browser.

### Default Credentials

| Username | Password |
|----------|----------|
| `admin` | `admin` |

### API Endpoints (require `Authorization: Bearer <token>`)

#### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login (returns JWT token) |

#### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | List notes (`?archived=true/false`, `?categoryId=1`) |
| GET | `/api/notes/:id` | Get note by ID |
| POST | `/api/notes` | Create note |
| PUT | `/api/notes/:id` | Update note |
| PATCH | `/api/notes/:id/archive` | Toggle archive |
| DELETE | `/api/notes/:id` | Delete note |
| POST | `/api/notes/:id/categories` | Add category to note |
| DELETE | `/api/notes/:id/categories/:catId` | Remove category |

#### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create category |
| DELETE | `/api/categories/:id` | Delete category |

## Deployment

### Deploy to Render (free)

1. Create an account at [render.com](https://render.com)
2. Connect your GitHub repository
3. Use **New + → Blueprint** and select this repository
4. Render will read `render.yaml` and automatically provision:
   - A PostgreSQL database
   - A Node.js web service
5. After ~5 minutes the app will be live at a URL like `https://notes-app.onrender.com`

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string (Render auto-provides this) | - |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USERNAME` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `DB_NAME` | Database name | `notes_app` |
| `PORT` | Backend server port | `3001` |
| `JWT_SECRET` | Secret key for JWT signing | `notes-app-secret-key-2024` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |
