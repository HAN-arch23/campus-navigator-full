# 🎓 Campus Navigator

A full-stack web app for booking campus study spaces. Built with React (frontend) and Node.js/Express/MongoDB (backend).

---

## 📁 Project Structure

```
campus-navigator-full/
├── campus-backend/       # Node.js + Express API
│   ├── models/           # Mongoose models (User, Room, Booking)
│   ├── routes/           # API routes
│   ├── middleware/       # Auth + error handling
│   ├── server.js         # Entry point
│   └── .env              # Environment variables
└── campus-frontend/      # React app
    ├── src/
    │   ├── components/   # UI components
    │   ├── context/      # Auth context
    │   ├── App.js        # Routing
    │   └── index.js      # Entry point
    └── .env              # Frontend env vars
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)

### 1. Backend Setup

```bash
cd campus-backend
npm install
# Edit .env if needed (especially MONGO_URI and JWT_SECRET)
npm run dev       # or: npm start
```

Backend runs on: http://localhost:5000

### 2. Frontend Setup

```bash
cd campus-frontend
npm install
npm start
```

Frontend runs on: http://localhost:3000

---

## 🌐 Deployment

### Backend → Railway / Render

1. Push to GitHub
2. Connect repo to [Railway](https://railway.app) or [Render](https://render.com)
3. Set root directory to `campus-backend`
4. Set start command: `node server.js`
5. Add environment variables:
   - `MONGO_URI` → your MongoDB Atlas URI
   - `JWT_SECRET` → a strong random string
   - `FRONTEND_URL` → your deployed frontend URL
   - `NODE_ENV` → `production`

### Frontend → Vercel / Netlify

1. Connect repo to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
2. Set root directory to `campus-frontend`
3. Build command: `npm run build`
4. Output directory: `build`
5. Add environment variable:
   - `REACT_APP_API_URL` → your deployed backend URL

### MongoDB → MongoDB Atlas

1. Create free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist all IPs (`0.0.0.0/0`) or your server IP
4. Get connection string and set as `MONGO_URI`

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Register user |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Get current user |
| PUT | `/api/auth/update-profile` | Yes | Update profile |
| POST | `/api/auth/forgot-password` | No | Request reset |
| POST | `/api/auth/reset-password/:token` | No | Reset password |
| GET | `/api/rooms` | No | List all rooms |
| POST | `/api/rooms` | Admin | Create room |
| GET | `/api/bookings` | No | List all bookings |
| POST | `/api/bookings` | No | Create booking |
| DELETE | `/api/bookings/:id` | No | Cancel booking |

---

## ✨ Features

- 🔐 JWT Authentication (signup, login, password reset)
- 🏢 Browse available campus study rooms
- 📅 Book rooms with date & time slot selection
- 📋 View and cancel your bookings
- 📱 Responsive design for mobile/desktop
- 🌙 Dark glassmorphism UI
# campus-navigator-full
