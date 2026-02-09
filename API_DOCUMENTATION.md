# RJBL API Documentation

Base URL (Local): `http://localhost:4000`
Base URL (Production): `https://chubby-benedikta-workabdul-fcd30ac0.koyeb.app`

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "user",
    "loyaltyPoints": 0,
    "referralCode": null,
    "favorites": [],
    "preferences": {},
    "adminPermissions": {}
  }
}
```

**Error (400):**
```json
{ "error": "Email and password are required" }
```

---

### Login User
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ...user object... }
}
```

**Error (401):**
```json
{ "error": "Invalid credentials" }
```

---

### Get Current User Profile
**GET** `/auth/me`

Requires authentication. Returns logged-in user's profile.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "user": { ...user object... }
}
```

**Error (401):**
```json
{ "error": "Unauthorized" }
```

---

### Update User Profile
**PUT** `/auth/me`

Update logged-in user's profile information.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+0987654321",
  "favorites": [1, 2, 3],
  "preferences": { "newsletter": true }
}
```

**Response (200):**
```json
{
  "user": { ...updated user object... }
}
```

---

## Services Endpoints

### List All Services
**GET** `/services`

Public endpoint. Returns all active services.

**Query Parameters:**
- None

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Haircut",
    "category": "Hair",
    "duration": "30 minutes",
    "price": "25.00",
    "description": "Professional haircut service",
    "image_url": "https://..."
  },
  ...
]
```

---

### Get Single Service
**GET** `/services/:id`

Public endpoint. Returns details of a single service.

**Response (200):**
```json
{
  "id": 1,
  "name": "Haircut",
  "category": "Hair",
  "duration": "30 minutes",
  "price": "25.00",
  "description": "Professional haircut service",
  "image_url": "https://..."
}
```

**Error (404):**
```json
{ "error": "Service not found" }
```

---

### Create Service
**POST** `/services`

Admin only. Create a new service.

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Haircut",
  "category": "Hair",
  "duration": "30 minutes",
  "price": 25.00,
  "description": "Professional haircut service",
  "imageUrl": "https://..."
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "Haircut",
  ...
}
```

---

### Update Service
**PUT** `/services/:id`

Admin only. Update an existing service.

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

**Request:** Same as Create Service

**Response (200):** Updated service object

---

### Delete Service
**DELETE** `/services/:id`

Admin only. Delete a service.

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Response (200):**
```json
{ "success": true }
```

---

## Products Endpoints

### List All Products
**GET** `/products`

Public endpoint. Returns all active products.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Shampoo",
    "category": "Hair Care",
    "price": "15.00",
    "original_price": "20.00",
    "stock": 50,
    "description": "Organic shampoo",
    "image_url": "https://...",
    "rating": 4.5,
    "reviews": 10
  },
  ...
]
```

---

### Get Single Product
**GET** `/products/:id`

Public endpoint. Returns details of a single product.

**Response (200):** Single product object (same structure as list)

---

### Create Product
**POST** `/products`

Admin only. Create a new product.

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Shampoo",
  "category": "Hair Care",
  "price": 15.00,
  "originalPrice": 20.00,
  "stock": 50,
  "description": "Organic shampoo",
  "imageUrl": "https://..."
}
```

**Response (201):** Created product object

---

### Update Product
**PUT** `/products/:id`

Admin only. Update product details.

**Response (200):** Updated product object

---

### Delete Product
**DELETE** `/products/:id`

Admin only. Delete a product.

**Response (200):** Success message

---

## Staff Endpoints

### List All Staff
**GET** `/staff`

Public endpoint. Returns all active staff members.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Sarah Johnson",
    "role": "Hairstylist",
    "availability": "Mon-Fri 9AM-5PM",
    "image_url": "https://..."
  },
  ...
]
```

---

### Create Staff Member
**POST** `/staff`

Admin only. Add a new staff member.

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Sarah Johnson",
  "role": "Hairstylist",
  "availability": "Mon-Fri 9AM-5PM",
  "imageUrl": "https://..."
}
```

---

## Bookings Endpoints

### Get Available Slots
**GET** `/bookings/slots?date=YYYY-MM-DD&staffId=ID`

Public endpoint. Returns available time slots for a staff member on a specific date.

**Response (200):**
```json
{
  "booked": ["09:00", "10:00", "14:30"]
}
```

---

### Get User's Bookings
**GET** `/bookings/mine`

Requires authentication. Returns all bookings for the logged-in user.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
[
  {
    "id": 1,
    "date": "2026-02-15",
    "time": "10:00",
    "status": "upcoming",
    "notes": "Special requests...",
    "rating": null,
    "feedback": null,
    "service_id": 1,
    "service_name": "Haircut",
    "duration": "30 minutes",
    "price": 25.00,
    "staff_id": 1,
    "staff_name": "Sarah Johnson"
  },
  ...
]
```

---

### Create Booking
**POST** `/bookings`

Requires authentication. Create a new service booking.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request:**
```json
{
  "serviceId": 1,
  "staffId": 1,
  "date": "2026-02-15",
  "time": "10:00",
  "notes": "Special requests here"
}
```

**Response (201):**
```json
{
  "id": 1,
  "user_id": 1,
  "service_id": 1,
  "staff_id": 1,
  "date": "2026-02-15",
  "time": "10:00",
  "status": "upcoming"
}
```

---

### Cancel Booking
**PUT** `/bookings/:id/cancel`

Requires authentication. Cancel an existing booking.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{ "status": "cancelled" }
```

---

### Submit Booking Feedback
**PUT** `/bookings/:id/feedback`

Requires authentication. Leave rating and feedback for a completed booking.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request:**
```json
{
  "rating": 5,
  "feedback": "Excellent service, highly recommend!"
}
```

**Response (200):**
```json
{ "success": true }
```

---

## Orders Endpoints

### Get User's Orders
**GET** `/orders/mine`

Requires authentication. Returns all orders placed by the logged-in user.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
[
  {
    "id": 1,
    "subtotal": "50.00",
    "total": "50.00",
    "currency": "usd",
    "status": "pending",
    "payment_method": "cod",
    "payment_status": "unpaid",
    "created_at": "2026-02-10T10:30:00Z"
  },
  ...
]
```

---

### Create COD Order
**POST** `/orders`

Requires authentication. Create a cash-on-delivery order.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request:**
```json
{
  "items": [
    { "productId": 1, "qty": 2 },
    { "productId": 3, "qty": 1 }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address": "123 Main St",
    "city": "New York",
    "email": "john@example.com"
  },
  "phone": "+1234567890"
}
```

**Response (201):**
```json
{
  "orderId": 1
}
```

**Error (409):**
```json
{ "error": "Insufficient stock for Product Name" }
```

---

## Payments Endpoints

### Create Stripe Checkout Session
**POST** `/payments/create-checkout-session`

Requires authentication. Create a Stripe payment session for cart checkout.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request:**
```json
{
  "items": [
    { "productId": 1, "qty": 2 },
    { "productId": 3, "qty": 1 }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address": "123 Main St",
    "city": "New York",
    "email": "john@example.com"
  },
  "phone": "+1234567890"
}
```

**Response (200):**
```json
{
  "url": "https://checkout.stripe.com/pay/cs_live_...",
  "sessionId": "cs_live_...",
  "orderId": 1
}
```

Redirect user to `url` for payment.

---

### Stripe Webhook
**POST** `/payments/webhook`

Public endpoint. Handles Stripe webhook events (payment success, failure, etc.).

**Required Header:**
```
Stripe-Signature: t=...,v1=...
```

**Body:** Stripe event JSON (auto-validated)

---

## Admin Endpoints

### List Staff Users
**GET** `/admin/staff`

Admin only. Returns all staff users with their permissions.

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Response (200):**
```json
[
  {
    "id": 2,
    "email": "staff@example.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "phone": "+0987654321",
    "role": "staff",
    "admin_permissions": {
      "services": { "read": true, "write": true },
      "products": { "read": true, "write": false }
    }
  },
  ...
]
```

---

### Set Staff Permissions
**PUT** `/admin/staff/:id/permissions`

Admin only. Grant/revoke permissions for a staff member.

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

**Request:**
```json
{
  "permissions": {
    "services": { "read": true, "write": true },
    "products": { "read": true, "write": false },
    "bookings": { "read": true, "write": false },
    "clients": { "read": false, "write": false }
  }
}
```

**Response (200):** Updated staff user object

---

## Clients Endpoints

### List All Clients
**GET** `/clients`

Requires `clients:read` permission. Returns all client records.

**Headers:**
```
Authorization: Bearer TOKEN (admin or staff with permission)
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "bookings": 5,
    "loyaltyPoints": 120
  },
  ...
]
```

---

## Health Check Endpoint

### Backend Health
**GET** `/health`

Public endpoint. Quick check that backend is running.

**Response (200):**
```json
{
  "ok": true,
  "service": "rjbl-backend"
}
```

---

### Database Test
**GET** `/db-test`

Public endpoint. Verifies database connectivity.

**Response (200):**
```json
{
  "ok": true,
  "now": "2026-02-10T10:30:45.123456Z"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Status Codes
- **200**: Success
- **201**: Created successfully
- **400**: Bad request (missing/invalid parameters)
- **401**: Unauthorized (missing or invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not found
- **409**: Conflict (e.g., duplicate email, insufficient stock)
- **500**: Server error

---

## Authentication

All protected endpoints require:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Where `YOUR_JWT_TOKEN` is obtained from:
- `/auth/register` response
- `/auth/login` response

Tokens expire after 8 hours. Request new token by logging in again.

---

## Rate Limiting

- Auth endpoints: 30 requests per minute per IP
- General endpoints: 300 requests per minute per IP

---

## CORS

Allowed origins:
- Local: `http://localhost:5173`, `http://localhost:3000`
- Production: `https://spabeautyproductproject.vercel.app`

---

Last Updated: February 10, 2026
