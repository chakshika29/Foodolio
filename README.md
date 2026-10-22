# 🍔 Foodolio — Full-Stack Food Delivery Web Application

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow)](#license)

**Foodolio** is a modern, responsive, full-stack food delivery web application built with the MERN stack (MongoDB, Express, React, Node.js) and Vite. It provides an end-to-end food ordering platform featuring a customer-facing ordering application, an administrative management dashboard, and a robust REST API backend.

---

## 🚀 Key Features

### 🛒 Customer Frontend
- **Interactive Menu & Category Filtering**: Browse dishes filtered by categories (Salads, Rolls, Desserts, Sandwich, Cake, Pasta, Noodles, Pure Veg).
- **Cart Management**: Add, decrement, and remove items with real-time subtotal calculation and delivery fee computation.
- **User Authentication**: Secure JWT-based registration and login with token persistence.
- **Database Cart Synchronization**: Cart items automatically sync with the user's account in MongoDB.
- **Dual Payment Options**:
  - **Cash on Delivery (COD)** with instant order confirmation.
  - **Stripe Card Payment** checkout with automated success/cancellation verification.
- **Order Tracking**: Real-time status tracking for customer orders (*Food Processing*, *Out for delivery*, *Delivered*).
- **Responsive Design**: Mobile-friendly layout with rich UI animations.

### 🛠️ Admin Dashboard
- **Food Catalog Management**: Add new dishes with image uploads, category selection, price, and descriptions.
- **Food Removal**: Instant deletion of menu items along with server image cleanup.
- **Order Management**: Real-time order monitoring displaying items, customer address, phone number, and payment status.
- **Live Status Control**: Update order status dynamically (*Food Processing* ➔ *Out for delivery* ➔ *Delivered*).

### ⚙️ Backend API
- **Modular MVC Architecture**: Separate controllers, routes, and Mongoose data models.
- **JWT Authentication Middleware**: Protected user cart and order routes.
- **Multer Storage Engine**: Handling image file uploads to `/uploads`.
- **Cross-Origin Resource Sharing (CORS)**: Configured for local development ports and production domains.
- **Health Check Endpoint**: `/api/health` providing live database readiness monitoring.

---

## 📁 Repository Structure

```
Foodolio/
├── backend/                # Express & Node.js REST API
│   ├── config/             # Database connection (MongoDB Mongoose)
│   ├── controllers/        # Route controllers (cart, food, order, user)
│   ├── middleware/         # Auth verification middleware
│   ├── models/             # Mongoose schemas (Food, Order, User)
│   ├── routes/             # Express API route declarations
│   ├── uploads/            # Uploaded food item images
│   ├── .env.example        # Backend environment template
│   └── server.js           # API entry point (Port 4000)
│
├── frontend/               # Customer React Application (Vite)
│   ├── src/
│   │   ├── components/     # Navbar, FoodDisplay, FoodItem, LoginPopup, etc.
│   │   ├── pages/          # Home, Cart, PlaceOrder, MyOrders, Verify
│   │   ├── Context/        # StoreContext (Global State & API handler)
│   │   └── assets/         # UI images & icons
│   ├── .env.example        # Frontend environment template
│   └── vercel.json         # SPA client-side routing rewrites
│
├── admin/                  # Restaurant Admin Dashboard (Vite)
│   ├── src/
│   │   ├── pages/          # Add Food, Food List, Order Management
│   │   └── components/     # Navbar, Sidebar
│   ├── .env.example        # Admin environment template
│   └── vercel.json         # SPA client-side routing rewrites
│
├── dev.js                  # Multi-service concurrent development runner
└── package.json            # Root workspace scripts
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router DOM 6, Axios, React Toastify |
| **Admin Panel** | React 18, Vite, React Router DOM 6, Axios, React Toastify |
| **Backend** | Node.js, Express.js, Mongoose, Multer, JSON Web Tokens (JWT), bcrypt, Stripe |
| **Database** | MongoDB Atlas / MongoDB Community Server |
| **Deployment** | Vercel (Frontend & Admin), Render / Railway (Backend API) |

---

## ⚙️ Environment Variables Setup

Before running the application, configure the environment variables:

### 1. Backend (`backend/.env`)
Create a `.env` file in the `backend/` directory:
```env
PORT=4000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/food-del?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
STRIPE_SECRET_KEY=sk_test_your_stripe_key_optional
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

### 2. Frontend (`frontend/.env`)
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:4000
```

### 3. Admin (`admin/.env`)
Create a `.env` file in the `admin/` directory:
```env
VITE_API_URL=http://localhost:4000
```

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/chakshika29/Foodolio.git
cd Foodolio
```

### 2. Install all dependencies
```bash
npm run install:all
```
*(Or manually run `npm install` inside `backend`, `frontend`, and `admin` folders).*

### 3. Start all services together
```bash
npm run dev:all
```

This single command launches:
- **Backend API**: [http://localhost:4000](http://localhost:4000)
- **Customer Frontend**: [http://localhost:5173](http://localhost:5173)
- **Admin Dashboard**: [http://localhost:5174](http://localhost:5174)

---

## 📜 Available NPM Scripts

From the root project directory:

| Command | Action |
| :--- | :--- |
| `npm run dev:all` | Concurrently runs Backend, Frontend, and Admin services |
| `npm run dev` | Concurrently runs Backend and Frontend services |
| `npm run dev:backend` | Starts only the Backend API server |
| `npm run dev:frontend` | Starts only the Customer Frontend |
| `npm run dev:admin` | Starts only the Admin Panel |
| `npm run build` | Builds both Frontend and Admin production bundles |
| `npm run install:all` | Installs dependencies across all three applications |

---

## 🔌 API Endpoints Reference

### User Authentication
- `POST /api/user/register` — Register a new customer
- `POST /api/user/login` — Sign in and receive JWT token

### Food Items
- `GET /api/food/list` — Retrieve all available food items
- `POST /api/food/add` — Add a new dish with an image upload (multipart/form-data)
- `POST /api/food/remove` — Delete a dish by ID

### Cart (Protected)
- `POST /api/cart/get` — Fetch logged-in user's cart
- `POST /api/cart/add` — Add an item to cart
- `POST /api/cart/remove` — Remove an item from cart

### Orders
- `POST /api/order/placecod` — Place an order with Cash on Delivery (Protected)
- `POST /api/order/place` — Initiate Stripe Checkout session (Protected)
- `POST /api/order/verify` — Verify Stripe checkout payment
- `POST /api/order/userorders` — Retrieve customer's order history (Protected)
- `GET /api/order/list` — Admin: List all orders
- `POST /api/order/status` — Admin: Update order delivery status

### System
- `GET /api/health` — Check server and database connection status
- `GET /images/<filename>` — Serve static food image uploads

---

## 🚢 Production Deployment

### 1. Backend (Render / Railway)
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Environment Variables**: Add `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, `ADMIN_URL`, `PORT=4000`.

### 2. Frontend (Vercel)
- **Root Directory**: `frontend`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: `VITE_API_URL=https://<your-backend-url>.onrender.com`

### 3. Admin Panel (Vercel)
- **Root Directory**: `admin`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: `VITE_API_URL=https://<your-backend-url>.onrender.com`

---

## 📄 License
This project is licensed under the **ISC License**.
