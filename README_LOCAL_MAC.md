# RJBL Full Project — MacBook Local Setup (VS Code)

This guide is **made for your exact ZIP project** (frontend + backend + postgres). Follow step-by-step — **nothing missing** ✅

---

## 0) What you will run (3 things)

1) **PostgreSQL** database (stores data)
2) **Backend** (Node/Express) at `http://localhost:4000`
3) **Frontend** (React/Vite) at `http://localhost:5173`

Admin page:
- `http://localhost:5173/admin`

---

## 1) Install required software (one time)

Open **Terminal** on macOS and run:

### 1.1 Homebrew
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 1.2 Node.js
```bash
brew install node
node -v
npm -v
```

### 1.3 PostgreSQL
```bash
brew install postgresql
brew services start postgresql
psql --version
```

---

## 2) Create database + create tables (schema)

### 2.1 Create the database
```bash
psql postgres
```
Then inside `psql`:
```sql
CREATE DATABASE rjbl;
\q
```

### 2.2 Create tables using `schema.sql`
Go to the **project root** (where `schema.sql` exists) and run:
```bash
psql -d rjbl -f ./schema.sql
```

### 2.3 Confirm tables are created
```bash
psql -d rjbl
```
Inside:
```sql
\dt
\q
```

---

## 3) Environment files (VERY IMPORTANT)

### 3.1 Backend env
1) Copy example env:
```bash
cp backend/.env.example backend/.env
```
2) Open `backend/.env` and set your DB user/password.

**Most common on macOS (no password):**

Find your username:
```bash
whoami
```

Then set (example if your username is `sadia`):
```env
DATABASE_URL=postgresql://sadia@localhost:5432/rjbl
```

If you have a password, use:
```env
DATABASE_URL=postgresql://YOURUSER:YOURPASS@localhost:5432/rjbl
```

### 3.2 Frontend env
```bash
cp frontend/.env.example frontend/.env
```
Default is already:
```env
VITE_API_BASE_URL=http://localhost:4000
```

---

## 4) Install project dependencies

From project root:
```bash
npm install
npm run install:all
```

---

## 5) Run the full project locally (one command)

From project root:
```bash
npm run dev
```

Now open:
- Frontend: `http://localhost:5173`
- Admin: `http://localhost:5173/admin`
- Backend: `http://localhost:4000`

---

## 6) Troubleshooting (most common issues)

### A) `psql: command not found`
Install / start postgres again:
```bash
brew install postgresql
brew services start postgresql
```

### B) Database permission / role error
Try running schema with your mac user:
```bash
psql -U $(whoami) -d rjbl -f ./schema.sql
```

### C) Backend says cannot connect to DB
Your `DATABASE_URL` is wrong. Try:
```env
DATABASE_URL=postgresql://$USER@localhost:5432/rjbl
```
Then restart `npm run dev`.

---

You can deploy later. See `DEPLOY_GUIDE.md`.
