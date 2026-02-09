# RJBL Backend API (Prototype)

This folder contains a **skeleton** REST API for the RJBL admin dashboard. It is **not** a drop‑in replacement for a production back‑end, but rather a starting point that demonstrates how you might structure the server and implement the core features described in the specification.

## Features

The following resources are exposed via JSON over HTTP:

- `/auth/register` and `/auth/login` for user registration and authentication (returns JWT tokens).
- `/services` to manage service offerings (CRUD operations).
- `/staff` to manage staff profiles (CRUD operations).
- `/clients` to manage client records (CRUD operations).
- `/products` to manage product inventory (CRUD operations).
- `/notifications/send` to send an SMS or WhatsApp message using Twilio.

All routes except `register` and `login` should eventually be protected by authentication middleware. This example does **not** implement role‑based access control or full validation – you will need to add that yourself.

## Prerequisites

- **Node.js** LTS (18.x or later) installed.
- **PostgreSQL** database. You can run it locally via Docker, on a VPS, or use a managed service.
- **Twilio** account and a verified phone number if you want to send SMS/WhatsApp notifications.

## Database Setup

Create a PostgreSQL database and run the included schema file:

```bash
psql -d rjbl -f schema.sql
```

If you prefer to define the tables manually, you can run SQL statements similar to the following:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user'
);

CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  duration TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL
);

CREATE TABLE staff (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  availability TEXT
);

CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  bookings INTEGER DEFAULT 0,
  loyalty_points INTEGER DEFAULT 0
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  stock INTEGER DEFAULT 0
);
```

Update the schema according to your exact requirements (e.g. promotions, scheduling rules, order tracking, etc.).

## Configuration

Create a `.env` file in the `backend` directory with the following keys (replace the example values with your own credentials):

```env
DATABASE_URL=postgresql://username:password@localhost:5432/rjbl
JWT_SECRET=supersecretjwtkey

# Twilio credentials – sign up at twilio.com and create a messaging service
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Phone numbers used for sending messages
TWILIO_PHONE_NUMBER=+12345678900       # for SMS
TWILIO_WHATSAPP_NUMBER=+12345678900    # for WhatsApp (without whatsapp: prefix)

# Port for the API server
PORT=4000
```

Install dependencies and start the server:

```bash
cd backend
npm install
npm start
```

The API will run on `http://localhost:4000`. You can test endpoints using tools like Postman or curl. For example, to list all services:

```bash
curl http://localhost:4000/services
```

## Connecting the Front‑end

The React admin dashboard you received is currently using in‑memory state. To connect it to this API you will need to replace the state mutations with HTTP requests. A simple example using the Fetch API looks like this:

```js
// fetch services and update local state
async function loadServices() {
  const res = await fetch('http://localhost:4000/services');
  const data = await res.json();
  setServices(data);
}

// create a service
async function createService(service) {
  await fetch('http://localhost:4000/services', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(service),
  });
  loadServices();
}
```

For protected routes you should attach the JWT returned from `/auth/login` in the `Authorization` header:

```js
const token = localStorage.getItem('token');
await fetch('http://localhost:4000/staff', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## Deploying to Production

1. **Choose a hosting provider** – popular options include Render, Fly.io, AWS Elastic Beanstalk, Heroku (paid tiers) or a VPS.
2. **Provision a managed database** (e.g. Amazon RDS, Supabase or DigitalOcean Managed Postgres). Update your `DATABASE_URL` accordingly.
3. **Set environment variables** for JWT secrets and Twilio credentials via your provider’s dashboard.
4. **Build and deploy the front‑end** separately (e.g. with Vercel or Netlify) and configure it to call your back‑end’s base URL.
5. **Secure your API** – implement HTTPS, role‑based access control, input validation and CSRF protection. Consider using libraries like `helmet` and `express-jwt`.

For Twilio integration, follow the official Twilio guide for Node.js. Twilio provides a Verify Quickstart that shows how to send SMS via Node/Express【386421639791672†L146-L156】 and requires you to sign up for an account and obtain API credentials. Ensure that you comply with any regional messaging regulations.

## Limitations

This codebase covers only the basic CRUD for a handful of entities and a simple notifications endpoint. It does **not** implement real‑time availability scheduling, inventory management, reporting, payments, or a CMS. Those pieces require careful design and cannot be auto‑generated. Use this as a foundation to build the robust system you need.