#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Notes App - Setup & Start ==="
echo ""

# --------------------------------------------------
# 1. Check prerequisites
# --------------------------------------------------
if ! command -v node &>/dev/null; then
  echo "Error: Node.js is not installed." >&2
  exit 1
fi

# --------------------------------------------------
# 2. Load environment variables (fallback defaults)
# --------------------------------------------------
if [ -f "$ROOT_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT_DIR/.env"
  set +a
fi

export DB_HOST="${DB_HOST:-localhost}"
export DB_PORT="${DB_PORT:-5432}"
export DB_USERNAME="${DB_USERNAME:-postgres}"
export DB_PASSWORD="${DB_PASSWORD:-postgres}"
export DB_NAME="${DB_NAME:-notes_app}"
export PORT="${PORT:-3001}"
export JWT_SECRET="${JWT_SECRET:-notes-app-secret-key-2024}"

# --------------------------------------------------
# 3. Start PostgreSQL via Docker if not running
# ------------------------------------------------->
if command -v docker &>/dev/null; then
  if ! docker ps --format '{{.Names}}' 2>/dev/null | grep -q 'notes-app-db'; then
    echo "--- Starting PostgreSQL (Docker) ---"
    docker compose -f "$ROOT_DIR/docker-compose.yml" up -d db
    echo "Waiting for PostgreSQL to be ready..."
    for i in {1..30}; do
      if docker exec notes-app-db pg_isready -U postgres &>/dev/null; then
        echo "PostgreSQL is ready."
        break
      fi
      sleep 1
    done
  else
    echo "--- PostgreSQL already running ---"
  fi
else
  echo "--- Docker not found, assuming PostgreSQL is already running on $DB_HOST:$DB_PORT ---"
fi

# --------------------------------------------------
# 4. Install backend dependencies & build
# --------------------------------------------------
echo ""
echo "--- Backend (NestJS) ---"
cd "$ROOT_DIR/backend"
npm install --silent
npm run build
echo "Starting backend on http://localhost:$PORT ..."
node dist/main.js &
BACKEND_PID=$!

# --------------------------------------------------
# 5. Install frontend dependencies & start
# --------------------------------------------------
echo ""
echo "--- Frontend (React + Vite) ---"
cd "$ROOT_DIR/frontend"
npm install --silent
echo "Starting frontend on http://localhost:5173 ..."
npx vite --host &
FRONTEND_PID=$!

# --------------------------------------------------
# 6. Print info & wait
# --------------------------------------------------
echo ""
echo "=== Both servers are starting ==="
echo "  Backend:  http://localhost:$PORT"
echo "  Frontend: http://localhost:5173"
echo "  Login:    admin / admin"
echo ""
echo "Press Ctrl+C to stop both."

cleanup() {
  echo ""
  echo "Shutting down..."
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null
  wait "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null
  echo "Done."
}
trap cleanup INT TERM

wait
