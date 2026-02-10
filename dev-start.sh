#!/bin/bash
set -e

PROJECT_ROOT="/Users/abdulraheem/Desktop/rjbl_FINAL_full_project"
PG_PATH="/usr/local/opt/postgresql@15/bin"

echo "=========================================="
echo "🚀 RJBL Local Dev Startup"
echo "=========================================="

# 1. Start PostgreSQL
echo ""
echo "1️⃣  Starting PostgreSQL..."
brew services start postgresql@15 || true
sleep 2

# 2. Ensure database and schema
echo "2️⃣  Setting up database and schema..."
$PG_PATH/psql -d postgres -c "CREATE USER IF NOT EXISTS rjbl_user WITH PASSWORD 'rjbl_password_local';" || true
$PG_PATH/psql -d postgres -c "CREATE DATABASE IF NOT EXISTS rjbl_db OWNER rjbl_user;" || true
$PG_PATH/psql -d rjbl_db -f "$PROJECT_ROOT/schema.sql" >/dev/null 2>&1 || true

# 3. Fix permissions
echo "3️⃣  Fixing database permissions..."
$PG_PATH/psql -d rjbl_db -c "DO \$\$ DECLARE r record; BEGIN FOR r IN SELECT tablename FROM pg_tables WHERE schemaname='public' LOOP EXECUTE format('ALTER TABLE %I OWNER TO rjbl_user', r.tablename); END LOOP; FOR r IN SELECT relname FROM pg_class WHERE relkind='S' AND relnamespace = 'public'::regnamespace LOOP EXECUTE format('ALTER SEQUENCE %I OWNER TO rjbl_user', r.relname); END LOOP; END \$\$;" >/dev/null 2>&1 || true

# 4. Kill existing Node processes
echo "4️⃣  Cleaning up old processes..."
pkill -f "node.*4000" || true
pkill -f "npm run dev" || true
sleep 1

# 5. Start Backend
echo "5️⃣  Starting Backend (http://localhost:4000)..."
cd "$PROJECT_ROOT/backend"
npm run dev > "$PROJECT_ROOT/backend.log" 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"
sleep 2

# 6. Start Frontend
echo "6️⃣  Starting Frontend (http://localhost:5173)..."
cd "$PROJECT_ROOT/frontend"
npm run dev -- --host 0.0.0.0 > "$PROJECT_ROOT/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"
sleep 3

# 7. Quick health check
echo ""
echo "7️⃣  Running health checks..."
echo ""

BACKEND_CHECK=$(curl -s http://localhost:4000/health | grep -o '"ok":true' || echo "FAIL")
echo "   Backend Health: $BACKEND_CHECK"

DB_CHECK=$(curl -s http://localhost:4000/db-test | grep -o '"ok":true' || echo "FAIL")
echo "   Database Check: $DB_CHECK"

FRONTEND_CHECK=$(curl -s http://localhost:5173 | grep -o "<!doctype" || echo "FAIL")
echo "   Frontend Health: $([ "$FRONTEND_CHECK" != "FAIL" ] && echo "OK" || echo "FAIL")"

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "📱 Access your app:"
echo "   Frontend: http://localhost:5173"
echo "   API:      http://localhost:4000"
echo ""
echo "📊 Database:"
echo "   Host:     localhost:5432"
echo "   Database: rjbl_db"
echo "   User:     rjbl_user"
echo "   Pass:     rjbl_password_local"
echo ""
echo "📝 Logs:"
echo "   Backend:  $PROJECT_ROOT/backend.log"
echo "   Frontend: $PROJECT_ROOT/frontend.log"
echo ""
echo "❌ To stop all services, run:"
echo "   brew services stop postgresql@15"
echo "   pkill -f 'node.*4000'"
echo "   pkill -f 'npm run dev'"
echo ""
