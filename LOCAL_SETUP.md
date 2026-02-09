# 🚀 Local Development Setup with Docker Compose

Complete guide to run **Database + Backend + Frontend** locally with one command.

---

## 📋 Prerequisites

1. **Docker** installed ([Download](https://www.docker.com/products/docker-desktop))
2. **Docker Compose** (included with Docker Desktop)
3. **Git** (for cloning the project)

**Verify installation:**
```bash
docker --version
docker-compose --version
```

---

## 🎯 Quick Start (3 Steps)

### Step 1: Navigate to Project Root
```bash
cd /Users/abdulraheem/Desktop/rjbl_FINAL_full_project
```

### Step 2: Start All Services
```bash
docker-compose up
```

This will:
- ✅ Create PostgreSQL database with `schema.sql`
- ✅ Start Express backend on `http://localhost:4000`
- ✅ Start React frontend on `http://localhost:5173`
- ✅ Connect everything automatically

### Step 3: Open in Browser
```
Frontend: http://localhost:5173
Backend API: http://localhost:4000
```

---

## 📊 What Gets Created

### PostgreSQL Database
- **Host**: `localhost:5432`
- **User**: `rjbl_user`
- **Password**: `rjbl_password_local`
- **Database**: `rjbl_db`
- **Tables**: All from `schema.sql` (loaded automatically)

### Backend Express Server
- **URL**: `http://localhost:4000`
- **Port**: 4000
- **Database**: Connected to PostgreSQL
- **Auto-reload**: Yes (hot reload on code changes)

### Frontend React App
- **URL**: `http://localhost:5173`
- **Port**: 5173
- **API Base**: `http://localhost:4000`
- **Auto-reload**: Yes (hot reload on code changes)

---

## 🔧 Useful Commands

### Start Everything
```bash
docker-compose up
```

### Start in Background
```bash
docker-compose up -d
```

### Stop Everything
```bash
docker-compose down
```

### Stop & Remove Database (WARNING: Deletes data)
```bash
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Only backend
docker-compose logs -f backend

# Only frontend
docker-compose logs -f frontend

# Only database
docker-compose logs -f postgres
```

### Access PostgreSQL from CLI
```bash
docker-compose exec postgres psql -U rjbl_user -d rjbl_db
```

Then try:
```sql
\dt  -- Show all tables
SELECT * FROM users LIMIT 5;  -- View users
\q   -- Exit
```

### Restart a Service
```bash
docker-compose restart backend
```

### Force Rebuild (if Dockerfile changed)
```bash
docker-compose up --build
```

---

## ✅ Verify Everything Works

### Test Backend Health
```bash
curl http://localhost:4000/health
```
**Expected:**
```json
{"ok":true,"service":"rjbl-backend"}
```

### Test Database Connection
```bash
curl http://localhost:4000/db-test
```
**Expected:**
```json
{"ok":true,"now":"2026-02-10T15:30:45.123Z"}
```

### Test Services API
```bash
curl http://localhost:4000/services
```
**Expected:** List of services in JSON

### Test Frontend
Open `http://localhost:5173` in browser. You should see the home page.

---

## 🐛 Troubleshooting

### Port Already in Use

**Error**: `Error starting userland proxy: listen tcp 0.0.0.0:5173: bind: address already in use`

**Fix**: Change port in `docker-compose.yml`
```yaml
frontend:
  ports:
    - "5174:5173"  # Changed from 5173 to 5174
```

Then access frontend on `http://localhost:5174`

### Database Connection Error

**Error**: `could not translate host name "postgres" to address`

**Fix**: Wait for PostgreSQL to start (check with `docker-compose logs postgres`)

### Cannot Access From Host

If Docker container can't reach another container:

1. Verify all containers running: `docker-compose ps`
2. Check they're on same network: `docker network ls`
3. Use service name as hostname (already configured)

### Clear Cache & Rebuild

```bash
docker-compose down
docker-compose up --build
```

---

## 📝 File Structure

```
rjbl_FINAL_full_project/
├── docker-compose.yml         ← Main config file
├── schema.sql                 ← Database schema
├── backend/
│   ├── Dockerfile             ← Backend container config
│   ├── .env.local             ← Local environment vars
│   ├── package.json
│   └── src/
│       ├── index.js           ← Express server
│       └── routes/            ← API endpoints
├── frontend/
│   ├── Dockerfile             ← Frontend container config
│   ├── .env.local             ← Local environment vars
│   ├── package.json
│   └── src/
│       ├── main.tsx           ← React entry
│       └── pages/             ← App pages
```

---

## 🚀 Development Workflow

### 1. Start Project
```bash
docker-compose up
```

### 2. Make Code Changes
- Edit files in `backend/src/` or `frontend/src/`
- Changes reload automatically (thanks to Docker volumes)

### 3. Test Changes
- Backend: Refresh API call (or test with curl)
- Frontend: Auto-reloads in browser

### 4. Check Logs
```bash
docker-compose logs -f backend
```

### 5. Debug Database
```bash
docker-compose exec postgres psql -U rjbl_user -d rjbl_db
```

---

## 📦 Environment Variables

### Backend (.env.local)
```bash
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://rjbl_user:rjbl_password_local@localhost:5432/rjbl_db
JWT_SECRET=local_dev_super_secret_jwt_key_change_in_production
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
STRIPE_SECRET_KEY=sk_test_local_development_key
STRIPE_SUCCESS_URL=http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}
STRIPE_CANCEL_URL=http://localhost:5173/payment/cancel
```

### Frontend (.env.local)
```bash
VITE_API_BASE_URL=http://localhost:4000
```

---

## 🔄 Switching Between Local & Production

### Local (Docker)
- Start with: `docker-compose up`
- Frontend loads from: `http://localhost:5173`
- Backend loads from: `http://localhost:4000`

### Production (Vercel + Koyeb + Neon)
- Frontend: Set env var `VITE_API_BASE_URL=https://koyeb-backend-url`
- Backend: Set env vars in Koyeb dashboard
- Database: Use Neon PostgreSQL URL

---

## 💾 Backup Database

Export data:
```bash
docker-compose exec postgres pg_dump -U rjbl_user rjbl_db > backup.sql
```

Import data:
```bash
docker-compose exec postgres psql -U rjbl_user rjbl_db < backup.sql
```

---

## 🛑 Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Container won't start | Docker not running | Start Docker Desktop |
| Port already in use | Another service using port | Change port in docker-compose.yml |
| Database won't connect | PostgreSQL container not healthy | Wait 30s, check logs |
| Frontend can't reach backend | Wrong API_BASE_URL | Verify VITE_API_BASE_URL=http://localhost:4000 |
| Volumes not updating | Docker volumes not mounted | Restart: `docker-compose restart` |

---

## 📚 Next Steps

1. ✅ Start with `docker-compose up`
2. ✅ Open `http://localhost:5173` in browser
3. ✅ Test API with `curl http://localhost:4000/health`
4. ✅ Register a test user
5. ✅ Test all features (browse services, add to cart, checkout)
6. ✅ Check database: `docker-compose exec postgres psql -U rjbl_user -d rjbl_db`

**Happy coding! 🎉**
