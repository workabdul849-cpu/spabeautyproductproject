# RJBL Deployment Guide (Frontend + Backend + Database)

This project is split into two deploys:

1) **Backend API** (Node/Express)
2) **Frontend Admin** (React/Vite)

And a third piece:

3) **PostgreSQL database** (managed database)

---

## Option A (recommended): Render (backend + Postgres) + Netlify (frontend)

### A1) Push code to GitHub
From project root:
```bash
git init
git add .
git commit -m "RJBL full project"
```
Create a GitHub repository and push:
```bash
git remote add origin <your repo url>
git push -u origin main
```

### A2) Create Postgres on Render
- Render → New → **PostgreSQL**
- Copy the connection string (DATABASE_URL)

### A3) Deploy Backend on Render
- Render → New → **Web Service** → connect your GitHub repo
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Add env vars:
  - `DATABASE_URL` (from Render Postgres)
  - `JWT_SECRET` (random long string)
  - `PORT` can be omitted (Render sets it) or keep

### A4) Run schema on the hosted DB
Use your local terminal:
```bash
psql "<PASTE YOUR RENDER DATABASE URL HERE>" -f schema.sql
```

### A5) Deploy Frontend on Netlify
- Netlify → Add new site → Import from Git
- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables:
  - `VITE_API_BASE_URL = https://<your-render-backend-url>`

Re-deploy (Netlify will build automatically).

---

## Option B: VPS (Nginx) — advanced
Use when you want full control. (Ask me if you want this path — I’ll give exact commands for Ubuntu + Nginx + SSL.)
