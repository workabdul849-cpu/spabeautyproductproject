# RJBL Spa & Beauty Project - Complete Setup Guide

## Project Overview

A full-stack spa and beauty booking + e-commerce platform with admin dashboard.

**Tech Stack:**
- **Frontend**: Vite + React 18 + TypeScript + Tailwind CSS (Deployed on Vercel)
- **Backend**: Node.js + Express.js (Deployed on Koyeb)
- **Database**: PostgreSQL (Neon)
- **Authentication**: JWT tokens + bcryptjs

---

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (Neon for production)
- Stripe account (optional, for payments)
- Git + GitHub account
- Vercel account (for frontend)
- Koyeb account (for backend)

---

## Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/workabdul849-cpu/spabeautyproductproject.git
cd spabeautyproductproject
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create local .env file
cat > .env << EOF
DATABASE_URL=postgresql://localhost:5432/rjbl
JWT_SECRET=your-local-secret-key-min-32-chars
PORT=4000
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
NODE_ENV=development
EOF

# Create database
createdb rjbl

# Load schema
psql rjbl < ../schema.sql

# Start backend
npm start
# Backend runs on http://localhost:4000
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create local .env file
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:4000
EOF

# Start dev server
npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Test Local Setup

```bash
# Backend health check
curl http://localhost:4000/health
# Expected: {"ok":true,"service":"rjbl-backend"}

# DB test
curl http://localhost:4000/db-test
# Expected: {"ok":true,"now":"2026-02-10T..."}

# Services list
curl http://localhost:4000/services
# Expected: [] (empty initially)

# Frontend
Open http://localhost:5173 in browser
```

---

## Production Deployment

### Database Setup (Neon)

1. Create account at https://console.neon.tech
2. Create new project
3. Copy connection string: `postgresql://user:password@host/dbname`
4. Run schema:
   ```bash
   psql "postgresql://user:password@host/dbname" < schema.sql
   ```

### Backend Deployment (Koyeb)

1. Create account at https://koyeb.com
2. Connect GitHub repository
3. Create new app from `/backend` directory
4. Set environment variables:
   ```
   DATABASE_URL=postgresql://user:password@host/dbname
   JWT_SECRET=[secure-random-string-min-32-chars]
   PORT=8000
   NODE_ENV=production
   CORS_ORIGINS=https://spabeautyproductproject.vercel.app,https://www.spabeautyproductproject.vercel.app
   STRIPE_SECRET_KEY=[your-stripe-key]
   ```
5. Deploy

### Frontend Deployment (Vercel)

1. Create account at https://vercel.com
2. Import GitHub repository
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `./frontend`
4. Set environment variables:
   ```
   VITE_API_BASE_URL=https://your-koyeb-domain.koyeb.app
   ```
5. Deploy

---

## Project Structure

```
/backend
  /src
    /routes         # API endpoints (auth, services, products, bookings, orders, admin)
    /middleware     # Auth, rate limiting
    db.js           # PostgreSQL pool
    index.js        # Express app setup
  .env              # Local environment variables
  .env.koyeb        # Production environment template
  package.json

/frontend
  /src
    /pages          # Page components (Home, Services, Admin, etc.)
    /components     # Reusable components
    /context        # Auth, Cart contexts
    /lib            # API helpers, utilities
  .env              # Local environment variables
  .env.production   # Production environment
  vercel.json       # SPA routing config
  package.json
  vite.config.ts

/schema.sql         # PostgreSQL schema (tables, indexes)
```

---

## API Endpoints Reference

### Authentication
- `POST /auth/register` - Create new user account
- `POST /auth/login` - Login user, returns JWT token
- `GET /auth/me` - Get current user profile (requires auth)
- `PUT /auth/me` - Update user profile (requires auth)

### Services
- `GET /services` - List all services (public)
- `GET /services/:id` - Get single service (public)
- `POST /services` - Create service (requires admin)
- `PUT /services/:id` - Update service (requires admin)
- `DELETE /services/:id` - Delete service (requires admin)

### Products
- `GET /products` - List all products (public)
- `GET /products/:id` - Get single product (public)
- `POST /products` - Create product (requires admin)
- `PUT /products/:id` - Update product (requires admin)
- `DELETE /products/:id` - Delete product (requires admin)

### Bookings
- `GET /bookings/mine` - User's bookings (requires auth)
- `GET /bookings/slots?date=YYYY-MM-DD&staffId=ID` - Available time slots (public)
- `POST /bookings` - Create booking (requires auth)
- `PUT /bookings/:id` - Update booking (requires auth)
- `PUT /bookings/:id/cancel` - Cancel booking (requires auth)
- `PUT /bookings/:id/feedback` - Submit booking feedback (requires auth)

### Orders
- `GET /orders/mine` - User's orders (requires auth)
- `POST /orders` - Create COD order (requires auth)

### Payments
- `POST /payments/create-checkout-session` - Create Stripe checkout session (requires auth)
- `POST /payments/webhook` - Stripe webhook (public, validates signature)

### Admin
- `GET /admin/staff` - List staff users (admin only)
- `PUT /admin/staff/:id/permissions` - Set staff permissions (admin only)

---

## User Roles & Permissions

### User (default)
- Browse services, products
- Create bookings
- Place orders
- View own profile and bookings

### Staff
- Access admin panel (with granted permissions)
- Manage assigned services/products (based on permissions)
- View bookings

### Admin
- Full access to all admin panels
- Manage services, products, staff, clients
- View analytics
- Set staff permissions

### Permission Structure
Admins grant staff specific permissions per module:
```json
{
  "services": { "read": true, "write": true },
  "products": { "read": true, "write": false },
  "bookings": { "read": true, "write": false },
  "clients": { "read": true, "write": false }
}
```

---

## Database Schema

### Tables
- **users**: Account information, role, loyalty points
- **services**: Spa services (haircut, massage, etc.)
- **staff**: Staff members assigned to services
- **clients**: Client contact information
- **products**: Beauty products for sale
- **bookings**: Service bookings with status tracking
- **orders**: Product orders with items
- **order_items**: Individual line items in orders
- **notifications**: Email/SMS notifications queue

---

## Feature Checklist

### Authentication ✅
- [x] User registration
- [x] User login with JWT
- [x] Token persistence
- [x] Profile management
- [x] Role-based access control

### Services & Bookings ✅
- [x] Browse services
- [x] View service details
- [x] Book services with staff selection
- [x] Check available time slots
- [x] View my bookings
- [x] Cancel bookings
- [x] Provide feedback/ratings

### E-Commerce ✅
- [x] Browse products
- [x] Add to cart
- [x] View cart
- [x] Checkout
- [x] COD orders
- [x] Stripe payment integration
- [x] Order confirmation
- [x] Inventory management

### Admin Dashboard ✅
- [x] Services management (CRUD)
- [x] Products management (CRUD)
- [x] Staff management
- [x] Client management
- [x] Permission management
- [x] Dashboard statistics

### Frontend Features ✅
- [x] Responsive design
- [x] SPA routing
- [x] Real-time UI updates
- [x] Error handling
- [x] Loading states

---

## Testing Checklist

### Manual Testing
- [ ] Register new user
- [ ] Login with email/password
- [ ] Browse services and products
- [ ] Add items to cart
- [ ] Complete checkout (COD)
- [ ] Book a service
- [ ] View bookings in profile
- [ ] Cancel booking
- [ ] Admin login
- [ ] Create/edit/delete service
- [ ] View dashboard stats

### API Testing
```bash
# Register user
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User","phone":"1234567890"}'

# Login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get services
curl http://localhost:4000/services

# Create booking (requires token)
curl -X POST http://localhost:4000/bookings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"serviceId":1,"staffId":1,"date":"2026-02-15","time":"10:00"}'
```

---

## Troubleshooting

### Backend Issues

**Cannot connect to database:**
- Verify DATABASE_URL is correct
- Check PostgreSQL is running: `psql -U postgres -d rjbl -c "SELECT 1"`
- Verify schema is loaded: `psql -d rjbl -c "\dt"`

**JWT_SECRET not set:**
- Ensure .env file has JWT_SECRET variable
- Restart backend after setting env var

**CORS errors:**
- Check CORS_ORIGINS matches your frontend URL
- Ensure Origin header is sent in browser requests

### Frontend Issues

**API calls return 404:**
- Verify VITE_API_BASE_URL matches backend URL
- Check backend is running: `curl http://localhost:4000/health`

**Routes return 404 (e.g., /admin, /services/123):**
- Verify vercel.json exists with SPA rewrite config
- Restart dev server after adding vercel.json

**Auth token not persisting:**
- Check localStorage is enabled in browser
- Verify token is being saved in AuthContext

---

## Support

For issues or questions:
1. Check error messages in browser console (Frontend tab)
2. Check backend logs: `npm start` output
3. Check database connection: `curl http://localhost:4000/db-test`
4. Review API response in Network tab (DevTools)

---

## Security Notes

⚠️ **IMPORTANT FOR PRODUCTION**

1. **JWT_SECRET**: Use a secure random 32+ character string
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Database**: Use strong passwords, enable SSL connections

3. **Stripe Key**: Never commit STRIPE_SECRET_KEY to git

4. **CORS**: Only allow trusted domains in production

5. **Rate Limiting**: Enabled on auth endpoints, can be adjusted

---

## License

Proprietary - All rights reserved

---

Last Updated: February 10, 2026
